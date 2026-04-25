import { DeleteAll } from '../DeleteAll';
import { DeleteAllErrors } from '../DeleteAllErrors';
import { Interface as ITransactionsRepo } from '../../../repos/Interface';
import { AppError } from '../../../../../shared/core/AppError';
import { makeTransactionStub } from '../../../../../shared/test-utils/makeTransactionStub';

const makeTransactionsRepo = (): jest.Mocked<Pick<ITransactionsRepo, 'getAllByProcessedIncomesId'>> => ({
  getAllByProcessedIncomesId: jest.fn(),
});

const makeDeleteUseCase = () => ({
  execute: jest.fn(),
});

const makeRequest = (overrides = {}) => ({
  processedIncomesId: 'pi-uuid',
  ...overrides,
});

describe('DeleteAll (delete-all-by-processed-incomes-id)', () => {
  let useCase: DeleteAll;
  let transactionsRepo: jest.Mocked<any>;
  let deleteUseCase: ReturnType<typeof makeDeleteUseCase>;

  beforeEach(() => {
    transactionsRepo = makeTransactionsRepo();
    deleteUseCase = makeDeleteUseCase();
    useCase = new DeleteAll(deleteUseCase as any, transactionsRepo);
  });

  describe('errors', () => {
    it('deve retornar ProcessedIncomesDoesntExistError quando repo retorna null', async () => {
      transactionsRepo.getAllByProcessedIncomesId.mockResolvedValue(null);

      const result = await useCase.execute(makeRequest());

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(DeleteAllErrors.ProcessedIncomesDoesntExistError);
      expect(deleteUseCase.execute).not.toHaveBeenCalled();
    });

    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      transactionsRepo.getAllByProcessedIncomesId.mockRejectedValue(new Error('DB error'));

      const result = await useCase.execute(makeRequest());

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve deletar todas as transações do processedIncomes em sequência', async () => {
      const transactions = [
        makeTransactionStub({ id: 'tx-1', processedIncomesId: 'pi-uuid' }),
        makeTransactionStub({ id: 'tx-2', processedIncomesId: 'pi-uuid' }),
      ];
      transactionsRepo.getAllByProcessedIncomesId.mockResolvedValue(transactions);
      deleteUseCase.execute.mockResolvedValue({ isRight: () => true });

      const result = await useCase.execute(makeRequest());

      expect(result.isRight()).toBe(true);
      expect(deleteUseCase.execute).toHaveBeenCalledTimes(2);
    });

    it('deve retornar sucesso com lista vazia', async () => {
      transactionsRepo.getAllByProcessedIncomesId.mockResolvedValue([]);

      const result = await useCase.execute(makeRequest());

      expect(result.isRight()).toBe(true);
      expect(deleteUseCase.execute).not.toHaveBeenCalled();
    });

    it('deve chamar deleteUseCase com userId vazio (sem contexto de usuário)', async () => {
      const transactions = [makeTransactionStub({ id: 'tx-1' })];
      transactionsRepo.getAllByProcessedIncomesId.mockResolvedValue(transactions);
      deleteUseCase.execute.mockResolvedValue({ isRight: () => true });

      await useCase.execute(makeRequest());

      expect(deleteUseCase.execute).toHaveBeenCalledWith({ id: 'tx-1', userId: '' });
    });
  });
});
