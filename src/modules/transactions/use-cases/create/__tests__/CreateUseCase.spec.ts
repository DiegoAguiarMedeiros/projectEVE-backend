import { CreateUseCase } from '../CreateUseCase';
import { CreateErrors } from '../CreateErrors';
import { Interface as ITransactionsRepo } from '../../../repos/Interface';
import { Interface as IEnvelopeRepo } from '../../../../envelopes/repos/Interface';
import { AppError } from '../../../../../shared/core/AppError';
import { makeTransactionStub } from '../../../../../shared/test-utils/makeTransactionStub';

const makeTransactionsRepo = (): jest.Mocked<ITransactionsRepo> => ({
  getAll: jest.fn(),
  create: jest.fn(),
  getById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  getAllByEnvelope: jest.fn(),
  getAllByProcessedIncomesId: jest.fn(),
  getAllByDebtId: jest.fn(),
  updateStatus: jest.fn(),
  getIncomesMonthOverview: jest.fn(),
  getGoalsMonthOverview: jest.fn(),
  getGoalsCumulativeAmount: jest.fn(),
  getExpensesMonthOverview: jest.fn(),
  getIncomesByYear: jest.fn(),
  getGoalsByYear: jest.fn(),
  getExpensesByYear: jest.fn(),
  getUpcomingPendingTransaction: jest.fn(),
  resetToUnprocessed: jest.fn(),
  getDebtTransactionsByMonth: jest.fn(),
  resetDebtsByMonth: jest.fn(),
  getOrphanedTransactionsByMonth: jest.fn(),
  deleteOrphanedByUserAndMonth: jest.fn(),
  existsByDescriptionAndMonth: jest.fn(),
  getTotalPendingDebitsByEnvelope: jest.fn(),
});

const makeEnvelopeRepo = (): jest.Mocked<Pick<IEnvelopeRepo, 'getOnlyById' | 'getAmount' | 'addAmount' | 'createAmount'>> => ({
  getOnlyById: jest.fn(),
  getAmount: jest.fn(),
  addAmount: jest.fn(),
  createAmount: jest.fn(),
});

const makeRequest = (overrides = {}) => ({
  userId: 'user-123',
  envelopeId: 'env-uuid',
  description: 'Compra no mercado',
  amount: 100,
  date: new Date('2026-03-01'),
  type: 'Debit' as const,
  status: 'transaction.status.pending' as const,
  paymentMethod: 'envelope.transaction.payment_method.Pix' as const,
  ...overrides,
});

describe('CreateUseCase', () => {
  let useCase: CreateUseCase;
  let transactionsRepo: jest.Mocked<ITransactionsRepo>;
  let envelopeRepo: jest.Mocked<any>;

  beforeEach(() => {
    transactionsRepo = makeTransactionsRepo();
    envelopeRepo = makeEnvelopeRepo();
    useCase = new CreateUseCase(transactionsRepo, envelopeRepo as any);
  });

  describe('errors', () => {
    it('deve retornar falha quando description é vazia', async () => {
      const result = await useCase.execute(makeRequest({ description: '' }));
      expect(result.isLeft()).toBe(true);
      expect(transactionsRepo.create).not.toHaveBeenCalled();
    });

    it('deve retornar falha quando amount é null', async () => {
      const result = await useCase.execute(makeRequest({ amount: null }));
      expect(result.isLeft()).toBe(true);
      expect(transactionsRepo.create).not.toHaveBeenCalled();
    });

    it('deve retornar ExceedsEnvelopeBudget quando débito excede saldo do envelope', async () => {
      envelopeRepo.getAmount.mockResolvedValue(50);
      transactionsRepo.getTotalPendingDebitsByEnvelope.mockResolvedValue(0);

      const result = await useCase.execute(makeRequest({ type: 'Debit', amount: 100 }));

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(CreateErrors.ExceedsEnvelopeBudget);
      expect(transactionsRepo.create).not.toHaveBeenCalled();
    });

    it('deve retornar EnvelopeNotFound quando status=completed e envelope não existe', async () => {
      envelopeRepo.getAmount.mockResolvedValue(500);
      transactionsRepo.getTotalPendingDebitsByEnvelope.mockResolvedValue(0);
      transactionsRepo.create.mockResolvedValue(undefined);
      envelopeRepo.getOnlyById.mockResolvedValue(null);

      const result = await useCase.execute(makeRequest({ status: 'transaction.status.completed', amount: 50 }));

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(CreateErrors.EnvelopeNotFound);
    });

    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      envelopeRepo.getAmount.mockRejectedValue(new Error('DB offline'));

      const result = await useCase.execute(makeRequest());

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve criar transação pending sem verificar budget para tipo Credit', async () => {
      transactionsRepo.create.mockResolvedValue(undefined);

      const result = await useCase.execute(makeRequest({ type: 'Credit', status: 'transaction.status.pending' }));

      expect(result.isRight()).toBe(true);
      expect(transactionsRepo.create).toHaveBeenCalledTimes(1);
      expect(envelopeRepo.getAmount).not.toHaveBeenCalled();
    });

    it('deve criar transação Debit dentro do orçamento disponível', async () => {
      envelopeRepo.getAmount.mockResolvedValue(500);
      transactionsRepo.getTotalPendingDebitsByEnvelope.mockResolvedValue(0);
      transactionsRepo.create.mockResolvedValue(undefined);

      const result = await useCase.execute(makeRequest({ type: 'Debit', amount: 100, status: 'transaction.status.pending' }));

      expect(result.isRight()).toBe(true);
      expect(transactionsRepo.create).toHaveBeenCalledTimes(1);
    });

    it('deve criar transação Debit com debtId sem verificar budget', async () => {
      transactionsRepo.create.mockResolvedValue(undefined);

      const result = await useCase.execute(makeRequest({ type: 'Debit', debtId: 'debt-uuid' }));

      expect(result.isRight()).toBe(true);
      expect(transactionsRepo.getTotalPendingDebitsByEnvelope).not.toHaveBeenCalled();
    });

    it('deve atualizar envelope amount quando status=completed e amount existe', async () => {
      const envelope = makeTransactionStub().envelopeId;
      envelopeRepo.getAmount
        .mockResolvedValueOnce(500) // budget check
        .mockResolvedValueOnce(500); // envelope update
      transactionsRepo.getTotalPendingDebitsByEnvelope.mockResolvedValue(0);
      transactionsRepo.create.mockResolvedValue(undefined);
      envelopeRepo.getOnlyById.mockResolvedValue({ id: 'env-uuid' });

      const result = await useCase.execute(makeRequest({
        type: 'Debit',
        amount: 50,
        status: 'transaction.status.completed',
      }));

      expect(result.isRight()).toBe(true);
      expect(envelopeRepo.addAmount).toHaveBeenCalledWith('env-uuid', 450, 2026, 3);
    });

    it('deve criar envelope amount quando status=completed e amount não existe', async () => {
      envelopeRepo.getAmount
        .mockResolvedValueOnce(500) // budget check
        .mockResolvedValueOnce(null); // envelope has no allocation yet
      transactionsRepo.getTotalPendingDebitsByEnvelope.mockResolvedValue(0);
      transactionsRepo.create.mockResolvedValue(undefined);
      envelopeRepo.getOnlyById.mockResolvedValue({ id: 'env-uuid' });

      const result = await useCase.execute(makeRequest({
        type: 'Debit',
        amount: 50,
        status: 'transaction.status.completed',
      }));

      expect(result.isRight()).toBe(true);
      expect(envelopeRepo.createAmount).toHaveBeenCalledWith('env-uuid', -50, 2026, 3);
    });

    it('deve criar Credit e somar ao envelope amount quando status=completed', async () => {
      envelopeRepo.getAmount.mockResolvedValue(100);
      transactionsRepo.create.mockResolvedValue(undefined);
      envelopeRepo.getOnlyById.mockResolvedValue({ id: 'env-uuid' });

      const result = await useCase.execute(makeRequest({
        type: 'Credit',
        amount: 50,
        status: 'transaction.status.completed',
      }));

      expect(result.isRight()).toBe(true);
      expect(envelopeRepo.addAmount).toHaveBeenCalledWith('env-uuid', 150, 2026, 3);
    });
  });
});
