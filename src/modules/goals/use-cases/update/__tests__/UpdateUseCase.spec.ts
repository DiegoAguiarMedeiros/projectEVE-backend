import { UpdateUseCase } from '../UpdateUseCase';
import { UpdateErrors } from '../UpdateErrors';
import { AppError } from '../../../../../shared/core/AppError';
import { Interface as IGoalsRepo } from '../../../repos/Interface';
import { Interface as IEnvelopeRepo } from '../../../../envelopes/repos/Interface';
import { GoalsMap } from '../../../mappers';

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

const makeGoal = () => GoalsMap.toDomain({
  id: 'goal-uuid',
  envelope_id: 'env-uuid',
  description: 'Comprar carro',
  amount: 500,
  amount_total: 50000,
  percentage: 1,
  deadline: new Date('2030-01-01'),
});

const makeRequest = (overrides = {}) => ({
  request: { id: 'goal-uuid', userId: 'user-uuid' },
  fieldUpdate: {
    description: 'Comprar casa',
    amount: 1000,
    amountTotal: 300000,
    percentage: 0.33,
    deadline: new Date('2035-06-01'),
  },
  ...overrides,
});

describe('UpdateGoalsUseCase', () => {
  let useCase: UpdateUseCase;
  let repo: jest.Mocked<IGoalsRepo>;
  let envelopeRepo: jest.Mocked<any>;

  beforeEach(() => {
    repo = makeGoalsRepo();
    envelopeRepo = makeEnvelopeRepo();
    useCase = new UpdateUseCase(repo, envelopeRepo);
  });

  describe('errors', () => {
    it('deve retornar NotFound quando goal não existe', async () => {
      repo.getById.mockResolvedValue(null);
      const result = await useCase.execute(makeRequest());
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(UpdateErrors.NotFound);
    });

    it('deve retornar UpdateError quando repo.update retorna false', async () => {
      repo.getById.mockResolvedValue(makeGoal());
      repo.update.mockResolvedValue(false);
      const result = await useCase.execute(makeRequest());
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(UpdateErrors.UpdateError);
    });

    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      repo.getById.mockRejectedValue(new Error('DB offline'));
      const result = await useCase.execute(makeRequest());
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });

    it('deve retornar falha quando percentage é inválida', async () => {
      repo.getById.mockResolvedValue(makeGoal());
      const result = await useCase.execute(makeRequest({
        fieldUpdate: { description: 'Teste', amount: 100, amountTotal: 1000, percentage: 150 },
      }));
      expect(result.isLeft()).toBe(true);
      expect(repo.update).not.toHaveBeenCalled();
    });
  });

  describe('success', () => {
    it('deve atualizar goal com sucesso', async () => {
      repo.getById.mockResolvedValue(makeGoal());
      repo.update.mockResolvedValue(true);
      const result = await useCase.execute(makeRequest());
      expect(result.isRight()).toBe(true);
      expect(repo.update).toHaveBeenCalledTimes(1);
    });

    it('deve chamar repo.update com os valores atualizados', async () => {
      repo.getById.mockResolvedValue(makeGoal());
      repo.update.mockResolvedValue(true);
      await useCase.execute(makeRequest());
      const [id, updatedGoal] = repo.update.mock.calls[0];
      expect(id).toBe('goal-uuid');
      expect(updatedGoal.description.value).toBe('Comprar casa');
      expect(updatedGoal.amount.value).toBe(1000);
    });

    it('deve manter valores originais para campos não fornecidos (falsy)', async () => {
      repo.getById.mockResolvedValue(makeGoal());
      repo.update.mockResolvedValue(true);
      await useCase.execute({
        request: { id: 'goal-uuid', userId: 'user-uuid' },
        fieldUpdate: { description: 'Novo nome', amount: 0, amountTotal: 0, percentage: 0, deadline: new Date('2030-01-01') },
      });
      const [, updatedGoal] = repo.update.mock.calls[0];
      expect(updatedGoal.amount.value).toBe(500);
      expect(updatedGoal.amountTotal.value).toBe(50000);
    });
  });
});
