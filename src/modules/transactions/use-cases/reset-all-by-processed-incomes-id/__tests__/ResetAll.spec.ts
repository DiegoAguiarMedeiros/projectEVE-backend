import { ResetAll } from '../ResetAll';
import { Interface as ITransactionsRepo } from '../../../repos/Interface';
import { AppError } from '../../../../../shared/core/AppError';
import { makeTransactionStub } from '../../../../../shared/test-utils/makeTransactionStub';

const makeTransactionsRepo = (): jest.Mocked<
  Pick<ITransactionsRepo, 'getAllByProcessedIncomesId' | 'delete' | 'resetToUnprocessed' | 'getDebtTransactionsByMonth' | 'resetDebtsByMonth'>
> => ({
  getAllByProcessedIncomesId: jest.fn(),
  delete: jest.fn(),
  resetToUnprocessed: jest.fn(),
  getDebtTransactionsByMonth: jest.fn(),
  resetDebtsByMonth: jest.fn(),
});

const makeEnvelopeRepo = () => ({
  getAmount: jest.fn(),
  addAmount: jest.fn(),
});

const makeRequest = (overrides = {}) => ({
  processedIncomesId: 'pi-uuid',
  userId: 'user-123',
  year: 2026,
  month: 3,
  ...overrides,
});

describe('ResetAll', () => {
  let useCase: ResetAll;
  let transactionsRepo: jest.Mocked<any>;
  let envelopeRepo: ReturnType<typeof makeEnvelopeRepo>;

  beforeEach(() => {
    transactionsRepo = makeTransactionsRepo();
    envelopeRepo = makeEnvelopeRepo();
    useCase = new ResetAll(transactionsRepo, envelopeRepo as any);
  });

  describe('errors', () => {
    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      transactionsRepo.getAllByProcessedIncomesId.mockRejectedValue(new Error('DB error'));

      const result = await useCase.execute(makeRequest());

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve reverter envelope para transações Debit completed e deletar transações sem debt', async () => {
      const completedDebit = makeTransactionStub({
        id: 'tx-1',
        status: 'transaction.status.completed',
        type: 'Debit',
        amount: 100,
      });
      const pendingNonDebt = makeTransactionStub({
        id: 'tx-2',
        status: 'transaction.status.pending',
      });
      transactionsRepo.getAllByProcessedIncomesId.mockResolvedValue([completedDebit, pendingNonDebt]);
      transactionsRepo.getDebtTransactionsByMonth.mockResolvedValue([]);
      transactionsRepo.delete.mockResolvedValue(undefined);
      transactionsRepo.resetToUnprocessed.mockResolvedValue(undefined);
      transactionsRepo.resetDebtsByMonth.mockResolvedValue(undefined);
      envelopeRepo.getAmount.mockResolvedValue(300);

      const result = await useCase.execute(makeRequest());

      expect(result.isRight()).toBe(true);
      // Deve reverter o envelope da transação completed Debit: 300 + 100 = 400
      expect(envelopeRepo.addAmount).toHaveBeenCalledWith('env-uuid', 400, 2026, 3);
      // Deve deletar ambas as transações sem debtId
      expect(transactionsRepo.delete).toHaveBeenCalledTimes(2);
    });

    it('deve reverter envelope para transações Credit completed', async () => {
      const completedCredit = makeTransactionStub({
        id: 'tx-1',
        status: 'transaction.status.completed',
        type: 'Credit',
        amount: 200,
      });
      transactionsRepo.getAllByProcessedIncomesId.mockResolvedValue([completedCredit]);
      transactionsRepo.getDebtTransactionsByMonth.mockResolvedValue([]);
      transactionsRepo.delete.mockResolvedValue(undefined);
      transactionsRepo.resetToUnprocessed.mockResolvedValue(undefined);
      transactionsRepo.resetDebtsByMonth.mockResolvedValue(undefined);
      envelopeRepo.getAmount.mockResolvedValue(500);

      const result = await useCase.execute(makeRequest());

      expect(result.isRight()).toBe(true);
      // Credit completed: 500 - 200 = 300
      expect(envelopeRepo.addAmount).toHaveBeenCalledWith('env-uuid', 300, 2026, 3);
    });

    it('não deve reverter envelope quando envelopeAmount é null', async () => {
      const completedDebit = makeTransactionStub({
        id: 'tx-1',
        status: 'transaction.status.completed',
        type: 'Debit',
        amount: 100,
      });
      transactionsRepo.getAllByProcessedIncomesId.mockResolvedValue([completedDebit]);
      transactionsRepo.getDebtTransactionsByMonth.mockResolvedValue([]);
      transactionsRepo.delete.mockResolvedValue(undefined);
      transactionsRepo.resetToUnprocessed.mockResolvedValue(undefined);
      transactionsRepo.resetDebtsByMonth.mockResolvedValue(undefined);
      envelopeRepo.getAmount.mockResolvedValue(null);

      const result = await useCase.execute(makeRequest());

      expect(result.isRight()).toBe(true);
      expect(envelopeRepo.addAmount).not.toHaveBeenCalled();
    });

    it('deve não deletar transações com debtId', async () => {
      const txWithDebt = makeTransactionStub({
        id: 'tx-1',
        status: 'transaction.status.pending',
        debtId: 'debt-uuid',
      });
      transactionsRepo.getAllByProcessedIncomesId.mockResolvedValue([txWithDebt]);
      transactionsRepo.getDebtTransactionsByMonth.mockResolvedValue([]);
      transactionsRepo.delete.mockResolvedValue(undefined);
      transactionsRepo.resetToUnprocessed.mockResolvedValue(undefined);
      transactionsRepo.resetDebtsByMonth.mockResolvedValue(undefined);

      const result = await useCase.execute(makeRequest());

      expect(result.isRight()).toBe(true);
      expect(transactionsRepo.delete).not.toHaveBeenCalled();
    });

    it('deve chamar resetToUnprocessed e resetDebtsByMonth sempre', async () => {
      transactionsRepo.getAllByProcessedIncomesId.mockResolvedValue([]);
      transactionsRepo.getDebtTransactionsByMonth.mockResolvedValue([]);
      transactionsRepo.resetToUnprocessed.mockResolvedValue(undefined);
      transactionsRepo.resetDebtsByMonth.mockResolvedValue(undefined);

      await useCase.execute(makeRequest());

      expect(transactionsRepo.resetToUnprocessed).toHaveBeenCalledWith('pi-uuid');
      expect(transactionsRepo.resetDebtsByMonth).toHaveBeenCalledWith('user-123', 2026, 3);
    });

    it('deve reverter envelope de debt transactions do mês que estavam completed', async () => {
      transactionsRepo.getAllByProcessedIncomesId.mockResolvedValue([]);
      const independentDebtTx = makeTransactionStub({
        id: 'tx-debt',
        status: 'transaction.status.completed',
        type: 'Debit',
        amount: 50,
        debtId: 'debt-uuid',
      });
      transactionsRepo.getDebtTransactionsByMonth.mockResolvedValue([independentDebtTx]);
      transactionsRepo.resetToUnprocessed.mockResolvedValue(undefined);
      transactionsRepo.resetDebtsByMonth.mockResolvedValue(undefined);
      envelopeRepo.getAmount.mockResolvedValue(200);

      const result = await useCase.execute(makeRequest());

      expect(result.isRight()).toBe(true);
      // Debit: 200 + 50 = 250
      expect(envelopeRepo.addAmount).toHaveBeenCalledWith('env-uuid', 250, 2026, 3);
    });
  });
});
