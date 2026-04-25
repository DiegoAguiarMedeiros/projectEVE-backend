import { DeleteAllUseCase } from '../DeleteAllUseCase';
import { AppError } from '../../../../../shared/core/AppError';
import { Interface as IGoalsRepo } from '../../../repos/Interface';

const makeGoalsRepo = (): jest.Mocked<IGoalsRepo> => ({
  getAll: jest.fn(),
  create: jest.fn(),
  getById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  deleteAll: jest.fn(),
});

describe('DeleteAllGoalsUseCase', () => {
  let useCase: DeleteAllUseCase;
  let repo: jest.Mocked<IGoalsRepo>;

  beforeEach(() => {
    repo = makeGoalsRepo();
    useCase = new DeleteAllUseCase(repo);
  });

  describe('errors', () => {
    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      repo.deleteAll.mockRejectedValue(new Error('DB offline'));
      const result = await useCase.execute({ ids: ['goal-uuid'], userId: 'user-uuid' });
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve deletar todos os goals com sucesso', async () => {
      repo.deleteAll.mockResolvedValue(2);
      const result = await useCase.execute({ ids: ['id-1', 'id-2'], userId: 'user-uuid' });
      expect(result.isRight()).toBe(true);
      expect(repo.deleteAll).toHaveBeenCalledWith(['id-1', 'id-2'], 'user-uuid');
    });

    it('deve chamar repo.deleteAll com ids e userId corretos', async () => {
      repo.deleteAll.mockResolvedValue(1);
      await useCase.execute({ ids: ['goal-uuid'], userId: 'user-uuid' });
      expect(repo.deleteAll).toHaveBeenCalledTimes(1);
      expect(repo.deleteAll).toHaveBeenCalledWith(['goal-uuid'], 'user-uuid');
    });
  });
});
