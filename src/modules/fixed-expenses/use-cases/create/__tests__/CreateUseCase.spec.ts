import { CreateUseCase } from '../CreateUseCase';
import { CreateErrors } from '../CreateErrors';
import { AppError } from '../../../../../shared/core/AppError';
import { Interface as IFixedExpenseRepo } from '../../../repos/Interface';
import { Interface as IEnvelopeRepo } from '../../../../envelopes/repos/Interface';
import { EnvelopesMap } from '../../../../envelopes/mappers';

const makeRepo = (): jest.Mocked<IFixedExpenseRepo> => ({
  getAll: jest.fn(),
  create: jest.fn(),
  getById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  deleteAll: jest.fn(),
  getTotalByEnvelope: jest.fn(),
});

const makeEnvelopeRepo = (): jest.Mocked<Pick<IEnvelopeRepo, 'getById'>> => ({
  getById: jest.fn(),
});

const makeEnvelope = () => EnvelopesMap.toDomain({
  id: 'env-uuid',
  name: 'Moradia',
  color: '#ffffff',
  order: 1,
  percentage: 30,
  user_id: 'user-uuid',
  EnvelopesAmounts: [],
});

const makeRequest = (overrides = {}) => ({
  userId: 'user-uuid',
  envelopeId: 'env-uuid',
  description: 'Conta de internet',
  amount: 120,
  paymentDay: 10,
  ...overrides,
});

describe('CreateFixedExpenseUseCase', () => {
  let useCase: CreateUseCase;
  let repo: jest.Mocked<IFixedExpenseRepo>;
  let envelopeRepo: jest.Mocked<any>;

  beforeEach(() => {
    repo = makeRepo();
    envelopeRepo = makeEnvelopeRepo();
    useCase = new CreateUseCase(repo, envelopeRepo);
  });

  describe('errors', () => {
    it('deve retornar EnvelopeNotFound quando envelope não existe', async () => {
      envelopeRepo.getById.mockResolvedValue(null);
      const result = await useCase.execute(makeRequest());
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(CreateErrors.EnvelopeNotFound);
    });

    it('não deve chamar repo.create quando envelope não é encontrado', async () => {
      envelopeRepo.getById.mockResolvedValue(null);
      await useCase.execute(makeRequest());
      expect(repo.create).not.toHaveBeenCalled();
    });

    it('deve retornar falha quando description é inválida', async () => {
      envelopeRepo.getById.mockResolvedValue(makeEnvelope());
      const result = await useCase.execute(makeRequest({ description: 'A' }));
      expect(result.isLeft()).toBe(true);
      expect(repo.create).not.toHaveBeenCalled();
    });

    it('deve retornar falha quando amount é negativo', async () => {
      envelopeRepo.getById.mockResolvedValue(makeEnvelope());
      const result = await useCase.execute(makeRequest({ amount: -1 }));
      expect(result.isLeft()).toBe(true);
    });

    it('deve retornar falha quando paymentDay está fora do range', async () => {
      envelopeRepo.getById.mockResolvedValue(makeEnvelope());
      const result = await useCase.execute(makeRequest({ paymentDay: 32 }));
      expect(result.isLeft()).toBe(true);
    });

    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      envelopeRepo.getById.mockResolvedValue(makeEnvelope());
      repo.create.mockRejectedValue(new Error('DB offline'));
      const result = await useCase.execute(makeRequest());
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve criar fixed expense com sucesso', async () => {
      envelopeRepo.getById.mockResolvedValue(makeEnvelope());
      repo.create.mockResolvedValue(undefined);
      const result = await useCase.execute(makeRequest());
      expect(result.isRight()).toBe(true);
      expect(repo.create).toHaveBeenCalledTimes(1);
    });

    it('deve criar com os valores corretos', async () => {
      envelopeRepo.getById.mockResolvedValue(makeEnvelope());
      repo.create.mockResolvedValue(undefined);
      await useCase.execute(makeRequest());
      const [fe] = repo.create.mock.calls[0];
      expect(fe.description.value).toBe('Conta de internet');
      expect(fe.amount.value).toBe(120);
      expect(fe.paymentDay.value).toBe(10);
    });
  });
});
