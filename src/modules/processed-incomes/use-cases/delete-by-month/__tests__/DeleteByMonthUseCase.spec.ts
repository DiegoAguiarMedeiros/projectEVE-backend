import { DeleteByMonthUseCase } from '../DeleteByMonthUseCase';
import { AppError } from '../../../../../shared/core/AppError';
import { Interface as IProcessedIncomesRepo } from '../../../repos/Interface';
import { ProcessedIncomesMap } from '../../../mappers';
import { makeTransactionStub } from '../../../../../shared/test-utils/makeTransactionStub';

const makeRepo = (): jest.Mocked<Pick<IProcessedIncomesRepo, 'getAllByYearMonth' | 'deleteAll'>> => ({
  getAllByYearMonth: jest.fn(),
  deleteAll: jest.fn(),
});

const makeResetAll = () => ({ execute: jest.fn() });

const makeTransactionsRepo = () => ({
  getDebtTransactionsByMonth: jest.fn(),
  resetDebtsByMonth: jest.fn(),
  deleteNonDebtByUserAndMonth: jest.fn(),
});

const makeEnvelopesRepo = () => ({
  deleteAmountsByUserAndMonth: jest.fn(),
});

const makeDebtRepo = () => ({
  updateInstallmentsPaid: jest.fn(),
});

const makePI = () => ProcessedIncomesMap.toDomain({
  id: 'pi-uuid',
  user_id: 'user-uuid',
  description: 'Processamento março',
  day: 5,
  month: 3,
  year: 2026,
  total_income_processed: 5000,
  processed_at: new Date('2026-03-05'),
  is_reprocessed: false,
  is_splitted: false,
  should_add_fixed_expenses: true,
  aux_id: null,
});

describe('DeleteByMonthUseCase', () => {
  let useCase: DeleteByMonthUseCase;
  let repo: jest.Mocked<any>;
  let resetAll: ReturnType<typeof makeResetAll>;
  let transactionsRepo: ReturnType<typeof makeTransactionsRepo>;
  let envelopesRepo: ReturnType<typeof makeEnvelopesRepo>;
  let debtRepo: ReturnType<typeof makeDebtRepo>;

  beforeEach(() => {
    repo = makeRepo();
    resetAll = makeResetAll();
    transactionsRepo = makeTransactionsRepo();
    envelopesRepo = makeEnvelopesRepo();
    debtRepo = makeDebtRepo();
    transactionsRepo.getDebtTransactionsByMonth.mockResolvedValue([]);
    transactionsRepo.resetDebtsByMonth.mockResolvedValue(undefined);
    transactionsRepo.deleteNonDebtByUserAndMonth.mockResolvedValue(undefined);
    envelopesRepo.deleteAmountsByUserAndMonth.mockResolvedValue(undefined);
    debtRepo.updateInstallmentsPaid.mockResolvedValue(undefined);
    useCase = new DeleteByMonthUseCase(
      repo as any,
      resetAll as any,
      transactionsRepo as any,
      envelopesRepo as any,
      debtRepo as any,
    );
  });

  describe('errors', () => {
    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      repo.getAllByYearMonth.mockRejectedValue(new Error('DB offline'));
      const result = await useCase.execute({ year: 2026, month: 3, userId: 'user-uuid' });
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve deletar processed incomes, transações não-dívida e saldos dos envelopes do mês com sucesso', async () => {
      repo.getAllByYearMonth.mockResolvedValue([makePI()]);
      resetAll.execute.mockResolvedValue(undefined);
      repo.deleteAll.mockResolvedValue(1);
      const result = await useCase.execute({ year: 2026, month: 3, userId: 'user-uuid' });
      expect(result.isRight()).toBe(true);
      expect(transactionsRepo.deleteNonDebtByUserAndMonth).toHaveBeenCalledWith('user-uuid', 2026, 3);
      expect(envelopesRepo.deleteAmountsByUserAndMonth).toHaveBeenCalledWith('user-uuid', 2026, 3);
      expect(repo.deleteAll).toHaveBeenCalledWith(['pi-uuid'], 'user-uuid');
    });

    it('deve chamar resetAll para cada item antes de deletar', async () => {
      const pi1 = makePI();
      const pi2 = makePI();
      repo.getAllByYearMonth.mockResolvedValue([pi1, pi2]);
      resetAll.execute.mockResolvedValue(undefined);
      repo.deleteAll.mockResolvedValue(2);
      await useCase.execute({ year: 2026, month: 3, userId: 'user-uuid' });
      expect(resetAll.execute).toHaveBeenCalledTimes(2);
    });

    it('deve limpar transações residuais, saldos e resetar dívidas mesmo quando o mês não tem processamentos', async () => {
      const completedDebtTx = makeTransactionStub({
        id: 'tx-debt',
        status: 'transaction.status.completed',
        debtId: 'debt-uuid',
      });
      repo.getAllByYearMonth.mockResolvedValue([]);
      transactionsRepo.getDebtTransactionsByMonth.mockResolvedValue([completedDebtTx]);
      const result = await useCase.execute({ year: 2026, month: 3, userId: 'user-uuid' });
      expect(result.isRight()).toBe(true);
      expect(resetAll.execute).not.toHaveBeenCalled();
      expect(debtRepo.updateInstallmentsPaid).toHaveBeenCalledWith('debt-uuid', -1);
      expect(transactionsRepo.resetDebtsByMonth).toHaveBeenCalledWith('user-uuid', 2026, 3);
      expect(transactionsRepo.deleteNonDebtByUserAndMonth).toHaveBeenCalledWith('user-uuid', 2026, 3);
      expect(envelopesRepo.deleteAmountsByUserAndMonth).toHaveBeenCalledWith('user-uuid', 2026, 3);
      expect(repo.deleteAll).not.toHaveBeenCalled();
    });
  });
});
