import { CreateUseCase } from '../CreateUseCase';
import { CreateErrors } from '../CreateErrors';
import { AppError } from '../../../../../shared/core/AppError';
import { Interface as IGoalsRepo } from '../../../repos/Interface';
import { Interface as IEnvelopeRepo } from '../../../../envelopes/repos/Interface';
import { EnvelopesMap } from '../../../../envelopes/mappers';

const makeGoalsRepo = (): jest.Mocked<IGoalsRepo> => ({
  getAll: jest.fn(),
  create: jest.fn(),
  getById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  deleteAll: jest.fn(),
});

const makeEnvelopeRepo = (): jest.Mocked<Pick<IEnvelopeRepo, 'getByName'>> => ({
  getByName: jest.fn(),
});

const makeEnvelope = () => EnvelopesMap.toDomain({
  id: 'env-uuid',
  name: 'goals',
  color: '#ffffff',
  order: 1,
  percentage: 10,
  user_id: 'user-uuid',
  EnvelopesAmounts: [],
});

const makeRequest = (overrides = {}) => ({
  userId: 'user-uuid',
  description: 'Comprar carro',
  amount: 500,
  amountTotal: 50000,
  percentage: 1,
  deadline: 10,
  monthYear: true,
  ...overrides,
});

describe('CreateGoalsUseCase', () => {
  let useCase: CreateUseCase;
  let goalsRepo: jest.Mocked<IGoalsRepo>;
  let envelopeRepo: jest.Mocked<any>;

  beforeEach(() => {
    goalsRepo = makeGoalsRepo();
    envelopeRepo = makeEnvelopeRepo();
    useCase = new CreateUseCase(goalsRepo, envelopeRepo);
  });

  describe('errors', () => {
    it('deve retornar EnvelopeNotFound quando envelope goals não existe', async () => {
      envelopeRepo.getByName.mockResolvedValue(null);
      const result = await useCase.execute(makeRequest());
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(CreateErrors.EnvelopeNotFound);
    });

    it('não deve chamar repo.create quando envelope não é encontrado', async () => {
      envelopeRepo.getByName.mockResolvedValue(null);
      await useCase.execute(makeRequest());
      expect(goalsRepo.create).not.toHaveBeenCalled();
    });

    it('deve retornar falha quando description é inválida', async () => {
      envelopeRepo.getByName.mockResolvedValue(makeEnvelope());
      const result = await useCase.execute(makeRequest({ description: 'A' }));
      expect(result.isLeft()).toBe(true);
      expect(goalsRepo.create).not.toHaveBeenCalled();
    });

    it('deve retornar falha quando amount é negativo', async () => {
      envelopeRepo.getByName.mockResolvedValue(makeEnvelope());
      const result = await useCase.execute(makeRequest({ amount: -1 }));
      expect(result.isLeft()).toBe(true);
    });

    it('deve retornar falha quando percentage está fora do range', async () => {
      envelopeRepo.getByName.mockResolvedValue(makeEnvelope());
      const result = await useCase.execute(makeRequest({ percentage: 101 }));
      expect(result.isLeft()).toBe(true);
    });

    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      envelopeRepo.getByName.mockResolvedValue(makeEnvelope());
      goalsRepo.create.mockRejectedValue(new Error('DB offline'));
      const result = await useCase.execute(makeRequest());
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve criar goal com sucesso', async () => {
      envelopeRepo.getByName.mockResolvedValue(makeEnvelope());
      goalsRepo.create.mockResolvedValue(undefined);
      const result = await useCase.execute(makeRequest());
      expect(result.isRight()).toBe(true);
      expect(goalsRepo.create).toHaveBeenCalledTimes(1);
    });

    it('deve chamar envelopeRepo.getByName com "goals" e userId', async () => {
      envelopeRepo.getByName.mockResolvedValue(makeEnvelope());
      goalsRepo.create.mockResolvedValue(undefined);
      await useCase.execute(makeRequest());
      expect(envelopeRepo.getByName).toHaveBeenCalledWith('goals', 'user-uuid');
    });

    it('deve criar goal com os valores corretos', async () => {
      envelopeRepo.getByName.mockResolvedValue(makeEnvelope());
      goalsRepo.create.mockResolvedValue(undefined);
      await useCase.execute(makeRequest());
      const [goal] = goalsRepo.create.mock.calls[0];
      expect(goal.description.value).toBe('Comprar carro');
      expect(goal.amount.value).toBe(500);
      expect(goal.amountTotal.value).toBe(50000);
      expect(goal.percentage.value).toBe(1);
      expect(goal.deadline).toBe(10);
      expect(goal.monthYear).toBe(true);
    });
  });
});
