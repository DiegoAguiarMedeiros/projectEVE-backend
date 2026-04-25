import { DeleteAll } from '../DeleteAll';
import { Interface as ITransactionsRepo } from '../../../repos/Interface';
import { AppError } from '../../../../../shared/core/AppError';
import { makeTransactionStub } from '../../../../../shared/test-utils/makeTransactionStub';

const makeTransactionsRepo = (): jest.Mocked<Pick<ITransactionsRepo, 'getAllByDebtId'>> => ({
  getAllByDebtId: jest.fn(),
});

const makeDeleteUseCase = () => ({
  execute: jest.fn(),
});

const makeRequest = (overrides = {}) => ({
  debtId: 'debt-uuid',
  userId: 'user-123',
  ...overrides,
});

describe('DeleteAll (delete-all-by-debt-id)', () => {
  let useCase: DeleteAll;
  let transactionsRepo: jest.Mocked<any>;
  let deleteUseCase: ReturnType<typeof makeDeleteUseCase>;

  beforeEach(() => {
    transactionsRepo = makeTransactionsRepo();
    deleteUseCase = makeDeleteUseCase();
    useCase = new DeleteAll(deleteUseCase as any, transactionsRepo);
  });

  describe('errors', () => {
    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      transactionsRepo.getAllByDebtId.mockRejectedValue(new Error('DB error'));

      const result = await useCase.execute(makeRequest());

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve deletar todas as transações do debt em paralelo', async () => {
      const transactions = [
        makeTransactionStub({ id: 'tx-1', debtId: 'debt-uuid' }),
        makeTransactionStub({ id: 'tx-2', debtId: 'debt-uuid' }),
        makeTransactionStub({ id: 'tx-3', debtId: 'debt-uuid' }),
      ];
      transactionsRepo.getAllByDebtId.mockResolvedValue(transactions);
      deleteUseCase.execute.mockResolvedValue({ isRight: () => true });

      const result = await useCase.execute(makeRequest());

      expect(result.isRight()).toBe(true);
      expect(deleteUseCase.execute).toHaveBeenCalledTimes(3);
    });

    it('deve retornar sucesso quando não há transações para o debt', async () => {
      transactionsRepo.getAllByDebtId.mockResolvedValue([]);

      const result = await useCase.execute(makeRequest());

      expect(result.isRight()).toBe(true);
      expect(deleteUseCase.execute).not.toHaveBeenCalled();
    });

    it('deve chamar deleteUseCase com id da transação e userId', async () => {
      const transactions = [makeTransactionStub({ id: 'tx-1' })];
      transactionsRepo.getAllByDebtId.mockResolvedValue(transactions);
      deleteUseCase.execute.mockResolvedValue({ isRight: () => true });

      await useCase.execute(makeRequest({ userId: 'user-456' }));

      expect(deleteUseCase.execute).toHaveBeenCalledWith(
        expect.objectContaining({ userId: 'user-456' })
      );
    });
  });
});
