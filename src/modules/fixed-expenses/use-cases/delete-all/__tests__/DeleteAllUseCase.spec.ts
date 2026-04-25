import { DeleteAllUseCase } from '../DeleteAllUseCase';
import { AppError } from '../../../../../shared/core/AppError';
import { Interface as IFixedExpenseRepo } from '../../../repos/Interface';

const makeRepo = (): jest.Mocked<IFixedExpenseRepo> => ({
  getAll: jest.fn(),
  create: jest.fn(),
  getById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  deleteAll: jest.fn(),
  getTotalByEnvelope: jest.fn(),
});

describe('DeleteAllFixedExpensesUseCase', () => {
  let useCase: DeleteAllUseCase;
  let repo: jest.Mocked<IFixedExpenseRepo>;

  beforeEach(() => {
    repo = makeRepo();
    useCase = new DeleteAllUseCase(repo);
  });

  describe('errors', () => {
    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      repo.deleteAll.mockRejectedValue(new Error('DB offline'));
      const result = await useCase.execute({ ids: ['fe-uuid'], userId: 'user-uuid' });
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve deletar todos os fixed expenses com sucesso', async () => {
      repo.deleteAll.mockResolvedValue(2);
      const result = await useCase.execute({ ids: ['id-1', 'id-2'], userId: 'user-uuid' });
      expect(result.isRight()).toBe(true);
      expect(repo.deleteAll).toHaveBeenCalledWith(['id-1', 'id-2'], 'user-uuid');
    });
  });
});
