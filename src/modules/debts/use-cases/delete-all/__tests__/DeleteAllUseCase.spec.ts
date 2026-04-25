import { DeleteAllUseCase } from '../DeleteAllUseCase';
import { AppError } from '../../../../../shared/core/AppError';
import { Interface as IDebtRepo } from '../../../repos/Interface';

const makeDebtRepo = (): jest.Mocked<IDebtRepo> => ({
  getAll: jest.fn(),
  create: jest.fn(),
  getById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  getOnlyById: jest.fn(),
  getTotal: jest.fn(),
  deleteAll: jest.fn(),
  updateInstallmentsPaid: jest.fn(),
});

describe('DeleteAllDebtsUseCase', () => {
  let useCase: DeleteAllUseCase;
  let repo: jest.Mocked<IDebtRepo>;

  beforeEach(() => {
    repo = makeDebtRepo();
    useCase = new DeleteAllUseCase(repo);
  });

  describe('errors', () => {
    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      repo.deleteAll.mockRejectedValue(new Error('DB offline'));
      const result = await useCase.execute({ ids: ['debt-uuid'], userId: 'user-uuid' });
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve deletar todos os debts com sucesso', async () => {
      repo.deleteAll.mockResolvedValue(2);
      const result = await useCase.execute({ ids: ['debt-1', 'debt-2'], userId: 'user-uuid' });
      expect(result.isRight()).toBe(true);
    });

    it('deve chamar repo.deleteAll com os ids e userId corretos', async () => {
      repo.deleteAll.mockResolvedValue(2);
      await useCase.execute({ ids: ['debt-1', 'debt-2'], userId: 'user-uuid' });
      expect(repo.deleteAll).toHaveBeenCalledWith(['debt-1', 'debt-2'], 'user-uuid');
    });

    it('deve funcionar com lista vazia de ids', async () => {
      repo.deleteAll.mockResolvedValue(0);
      const result = await useCase.execute({ ids: [], userId: 'user-uuid' });
      expect(result.isRight()).toBe(true);
    });
  });
});
