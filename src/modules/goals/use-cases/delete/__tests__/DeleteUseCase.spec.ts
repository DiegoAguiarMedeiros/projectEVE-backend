import { DeleteUseCase } from '../DeleteUseCase';
import { DeleteErrors } from '../DeleteErrors';
import { AppError } from '../../../../../shared/core/AppError';
import { Interface as IGoalsRepo } from '../../../repos/Interface';
import { GoalsMap } from '../../../mappers';

const makeGoalsRepo = (): jest.Mocked<IGoalsRepo> => ({
  getAll: jest.fn(),
  create: jest.fn(),
  getById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  deleteAll: jest.fn(),
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

describe('DeleteGoalsUseCase', () => {
  let useCase: DeleteUseCase;
  let repo: jest.Mocked<IGoalsRepo>;

  beforeEach(() => {
    repo = makeGoalsRepo();
    useCase = new DeleteUseCase(repo);
  });

  describe('errors', () => {
    it('deve retornar NotFound quando goal não existe', async () => {
      repo.getById.mockResolvedValue(null);
      const result = await useCase.execute({ id: 'goal-uuid', userId: 'user-uuid' });
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(DeleteErrors.NotFound);
    });

    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      repo.getById.mockRejectedValue(new Error('DB offline'));
      const result = await useCase.execute({ id: 'goal-uuid', userId: 'user-uuid' });
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });

    it('não deve chamar repo.delete quando goal não é encontrado', async () => {
      repo.getById.mockResolvedValue(null);
      await useCase.execute({ id: 'goal-uuid', userId: 'user-uuid' });
      expect(repo.delete).not.toHaveBeenCalled();
    });
  });

  describe('success', () => {
    it('deve deletar goal com sucesso', async () => {
      repo.getById.mockResolvedValue(makeGoal());
      repo.delete.mockResolvedValue(true);
      const result = await useCase.execute({ id: 'goal-uuid', userId: 'user-uuid' });
      expect(result.isRight()).toBe(true);
      expect(repo.delete).toHaveBeenCalledWith('goal-uuid');
    });
  });
});
