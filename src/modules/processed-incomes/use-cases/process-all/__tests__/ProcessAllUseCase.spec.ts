import { ProcessAllUseCase } from '../ProcessAllUseCase';
import { ProcessAllErrors } from '../ProcessAllErrors';
import { AppError } from '../../../../../shared/core/AppError';
import { Interface as IProcessedIncomesRepo } from '../../../repos/Interface';
import { Interface as IIncomesRepo } from '../../../../incomes/repos/Interface';
import { Interface as ITransactionsRepo } from '../../../../transactions/repos/Interface';
import { Interface as IEnvelopesRepo } from '../../../../envelopes/repos/Interface';
import { IncomesMap } from '../../../../incomes/mappers';
import { ProcessedIncomesMap } from '../../../mappers';
import { right, Result } from '../../../../../shared/core/Result';
import { EnvelopesMap } from '../../../../envelopes/mappers';

const makeProcessedIncomesRepo = (): jest.Mocked<Pick<IProcessedIncomesRepo, 'getAllByYearMonth' | 'delete' | 'create'>> => ({
  getAllByYearMonth: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(),
});

const makeIncomesRepo = (): jest.Mocked<Pick<IIncomesRepo, 'getAll'>> => ({
  getAll: jest.fn(),
});

const makeTransactionsRepo = (): jest.Mocked<Pick<ITransactionsRepo, 'getOrphanedTransactionsByMonth' | 'deleteOrphanedByUserAndMonth'>> => ({
  getOrphanedTransactionsByMonth: jest.fn(),
  deleteOrphanedByUserAndMonth: jest.fn(),
});

const makeDeleteAllTransactions = () => ({ execute: jest.fn() });
const makeDeleteTransactionUseCase = () => ({ execute: jest.fn() });
const makeEnvelopesRepo = () => ({
  getAll: jest.fn().mockResolvedValue([{ percentage: { value: 100 } }]),
});

const rawIncome = {
  id: 'income-uuid',
  user_id: 'user-uuid',
  description: 'Salário mensal',
  amount: 5000,
  payment_day: 5,
};

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

const makeRequest = (overrides = {}) => ({
  userId: 'user-uuid',
  year: 2026,
  month: 3,
  ...overrides,
});

describe('ProcessAllUseCase', () => {
  let useCase: ProcessAllUseCase;
  let processedIncomesRepo: jest.Mocked<any>;
  let incomesRepo: jest.Mocked<any>;
  let transactionsRepo: jest.Mocked<any>;
  let deleteAllTransactions: ReturnType<typeof makeDeleteAllTransactions>;
  let deleteTransactionUseCase: ReturnType<typeof makeDeleteTransactionUseCase>;
  let envelopesRepo: ReturnType<typeof makeEnvelopesRepo>;

  beforeEach(() => {
    processedIncomesRepo = makeProcessedIncomesRepo();
    incomesRepo = makeIncomesRepo();
    transactionsRepo = makeTransactionsRepo();
    deleteAllTransactions = makeDeleteAllTransactions();
    deleteTransactionUseCase = makeDeleteTransactionUseCase();
    envelopesRepo = makeEnvelopesRepo();
    useCase = new ProcessAllUseCase(
      processedIncomesRepo as any,
      incomesRepo as any,
      deleteAllTransactions as any,
      transactionsRepo as any,
      deleteTransactionUseCase as any,
      envelopesRepo as any,
    );
  });

  describe('errors', () => {
    it('deve retornar falha quando year é inválido', async () => {
      const result = await useCase.execute(makeRequest({ year: 0 }));
      expect(result.isLeft()).toBe(true);
    });

    it('deve retornar falha quando month é inválido (> 12)', async () => {
      const result = await useCase.execute(makeRequest({ month: 13 }));
      expect(result.isLeft()).toBe(true);
    });

    it('deve retornar NoIncomesFound quando não há incomes cadastrados', async () => {
      incomesRepo.getAll.mockResolvedValue([]);
      const result = await useCase.execute(makeRequest());
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(ProcessAllErrors.NoIncomesFound);
    });

    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      incomesRepo.getAll.mockRejectedValue(new Error('DB offline'));
      const result = await useCase.execute(makeRequest());
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    beforeEach(() => {
      incomesRepo.getAll.mockResolvedValue([IncomesMap.toDomain(rawIncome)]);
      processedIncomesRepo.getAllByYearMonth.mockResolvedValue([]);
      transactionsRepo.getOrphanedTransactionsByMonth.mockResolvedValue([]);
      transactionsRepo.deleteOrphanedByUserAndMonth.mockResolvedValue(undefined);
      processedIncomesRepo.create.mockResolvedValue(undefined);
    });

    it('deve processar incomes com sucesso', async () => {
      const result = await useCase.execute(makeRequest());
      expect(result.isRight()).toBe(true);
    });

    it('deve criar um processed income para cada income', async () => {
      const income2 = { ...rawIncome, id: 'income-2' };
      incomesRepo.getAll.mockResolvedValue([
        IncomesMap.toDomain(rawIncome),
        IncomesMap.toDomain(income2),
      ]);
      await useCase.execute(makeRequest());
      expect(processedIncomesRepo.create).toHaveBeenCalledTimes(2);
    });

    it('deve limpar processamentos anteriores do mesmo mês antes de criar novos', async () => {
      processedIncomesRepo.getAllByYearMonth.mockResolvedValue([makePI()]);
      deleteAllTransactions.execute.mockResolvedValue(right(Result.ok<void>()));
      processedIncomesRepo.delete.mockResolvedValue(true);

      await useCase.execute(makeRequest());

      expect(deleteAllTransactions.execute).toHaveBeenCalledTimes(1);
      expect(processedIncomesRepo.delete).toHaveBeenCalledTimes(1);
    });

    it('deve deletar transações órfãs do mês', async () => {
      await useCase.execute(makeRequest());
      expect(transactionsRepo.getOrphanedTransactionsByMonth).toHaveBeenCalledWith('user-uuid', 2026, 3);
      expect(transactionsRepo.deleteOrphanedByUserAndMonth).toHaveBeenCalledWith('user-uuid', 2026, 3);
    });

    it('deve marcar shouldAddFixedExpenses=true apenas no primeiro income', async () => {
      const income2 = { ...rawIncome, id: 'income-2' };
      incomesRepo.getAll.mockResolvedValue([
        IncomesMap.toDomain(rawIncome),
        IncomesMap.toDomain(income2),
      ]);
      await useCase.execute(makeRequest());
      const [first] = processedIncomesRepo.create.mock.calls[0];
      const [second] = processedIncomesRepo.create.mock.calls[1];
      expect(first.shouldAddFixedExpenses).toBe(true);
      expect(second.shouldAddFixedExpenses).toBe(false);
    });
  });
});
