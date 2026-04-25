import { DeleteAllUseCase } from '../DeleteAllUseCase';
import { AppError } from '../../../../../shared/core/AppError';
import { Interface as IProcessedIncomesRepo } from '../../../repos/Interface';

const makeRepo = (): jest.Mocked<Pick<IProcessedIncomesRepo, 'deleteAll'>> => ({
  deleteAll: jest.fn(),
});

const makeDeleteAllTransactions = () => ({ execute: jest.fn() });

describe('DeleteAllProcessedIncomesUseCase', () => {
  let useCase: DeleteAllUseCase;
  let repo: jest.Mocked<any>;
  let deleteAllTransactions: ReturnType<typeof makeDeleteAllTransactions>;

  beforeEach(() => {
    repo = makeRepo();
    deleteAllTransactions = makeDeleteAllTransactions();
    useCase = new DeleteAllUseCase(repo as any, deleteAllTransactions as any);
  });

  describe('errors', () => {
    it('deve retornar UnexpectedError quando deleteAllTransactions lança exceção', async () => {
      deleteAllTransactions.execute.mockRejectedValue(new Error('DB offline'));
      const result = await useCase.execute({ ids: ['pi-uuid'], userId: 'user-uuid' });
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });

    it('deve retornar UnexpectedError quando repo.deleteAll lança exceção', async () => {
      deleteAllTransactions.execute.mockResolvedValue(undefined);
      repo.deleteAll.mockRejectedValue(new Error('DB offline'));
      const result = await useCase.execute({ ids: ['pi-uuid'], userId: 'user-uuid' });
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve deletar todos os processed incomes com sucesso', async () => {
      deleteAllTransactions.execute.mockResolvedValue(undefined);
      repo.deleteAll.mockResolvedValue(2);
      const result = await useCase.execute({ ids: ['pi-1', 'pi-2'], userId: 'user-uuid' });
      expect(result.isRight()).toBe(true);
    });

    it('deve chamar deleteAllTransactions para cada id', async () => {
      deleteAllTransactions.execute.mockResolvedValue(undefined);
      repo.deleteAll.mockResolvedValue(2);
      await useCase.execute({ ids: ['pi-1', 'pi-2'], userId: 'user-uuid' });
      expect(deleteAllTransactions.execute).toHaveBeenCalledTimes(2);
    });

    it('deve chamar repo.deleteAll com ids e userId corretos', async () => {
      deleteAllTransactions.execute.mockResolvedValue(undefined);
      repo.deleteAll.mockResolvedValue(2);
      await useCase.execute({ ids: ['pi-1', 'pi-2'], userId: 'user-uuid' });
      expect(repo.deleteAll).toHaveBeenCalledWith(['pi-1', 'pi-2'], 'user-uuid');
    });
  });
});
