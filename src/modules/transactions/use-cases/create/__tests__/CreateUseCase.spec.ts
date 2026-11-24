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
  deleteNonDebtByUserAndMonth: jest.fn(),
  existsByDescriptionAndMonth: jest.fn(),
  getTotalPendingDebitsByEnvelope: jest.fn(),
});

const makeEnvelopeRepo = (): jest.Mocked<Pick<IEnvelopeRepo, 'getById' | 'getOnlyById' | 'getAmount' | 'addAmount' | 'createAmount' | 'adjustAmount'>> => ({
  getById: jest.fn(),
  getOnlyById: jest.fn(),
  getAmount: jest.fn(),
  addAmount: jest.fn(),
  createAmount: jest.fn(),
  adjustAmount: jest.fn(),
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

    it('deve retornar ExceedsEnvelopeBudget quando débito completed excede saldo do envelope', async () => {
      envelopeRepo.getById.mockResolvedValue({ id: 'env-uuid' });
      envelopeRepo.getAmount.mockResolvedValue(50);

      const result = await useCase.execute(makeRequest({
        type: 'Debit',
        amount: 100,
        status: 'transaction.status.completed',
      }));

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(CreateErrors.ExceedsEnvelopeBudget);
      expect(transactionsRepo.create).not.toHaveBeenCalled();
    });

    it('deve retornar ExceedsEnvelopeBudget quando débito completed e saldo do envelope é null (0)', async () => {
      envelopeRepo.getById.mockResolvedValue({ id: 'env-uuid' });
      envelopeRepo.getAmount.mockResolvedValue(null);

      const result = await useCase.execute(makeRequest({
        type: 'Debit',
        amount: 50,
        status: 'transaction.status.completed',
      }));

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(CreateErrors.ExceedsEnvelopeBudget);
      expect(transactionsRepo.create).not.toHaveBeenCalled();
    });

    it('deve retornar EnvelopeNotFound quando envelope não existe', async () => {
      envelopeRepo.getById.mockResolvedValue(null);

      const result = await useCase.execute(makeRequest({ status: 'transaction.status.completed', amount: 50 }));

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(CreateErrors.EnvelopeNotFound);
    });

    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      envelopeRepo.getById.mockRejectedValue(new Error('DB offline'));

      const result = await useCase.execute(makeRequest());

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve criar transação pending sem verificar budget para tipo Credit', async () => {
      envelopeRepo.getById.mockResolvedValue({ id: 'env-uuid' });
      transactionsRepo.create.mockResolvedValue(undefined);

      const result = await useCase.execute(makeRequest({ type: 'Credit', status: 'transaction.status.pending' }));

      expect(result.isRight()).toBe(true);
      expect(transactionsRepo.create).toHaveBeenCalledTimes(1);
      expect(envelopeRepo.getAmount).not.toHaveBeenCalled();
    });

    it('deve permitir criar transação Debit pending mesmo quando valor excede saldo do envelope', async () => {
      envelopeRepo.getById.mockResolvedValue({ id: 'env-uuid' });
      envelopeRepo.getAmount.mockResolvedValue(50);
      transactionsRepo.create.mockResolvedValue(undefined);

      const result = await useCase.execute(makeRequest({ type: 'Debit', amount: 1000, status: 'transaction.status.pending' }));

      expect(result.isRight()).toBe(true);
      expect(transactionsRepo.create).toHaveBeenCalledTimes(1);
      expect(envelopeRepo.getAmount).not.toHaveBeenCalled();
    });

    it('deve criar transação Debit com debtId pending sem verificar budget', async () => {
      envelopeRepo.getById.mockResolvedValue({ id: 'env-uuid' });
      transactionsRepo.create.mockResolvedValue(undefined);

      const result = await useCase.execute(makeRequest({ type: 'Debit', debtId: 'debt-uuid', status: 'transaction.status.pending' }));

      expect(result.isRight()).toBe(true);
      expect(transactionsRepo.getTotalPendingDebitsByEnvelope).not.toHaveBeenCalled();
    });

    it('deve ajustar envelope amount atomicamente com delta negativo quando Debit e status=completed dentro do saldo', async () => {
      envelopeRepo.getById.mockResolvedValue({ id: 'env-uuid' });
      envelopeRepo.getAmount.mockResolvedValueOnce(500);
      transactionsRepo.create.mockResolvedValue(undefined);

      const result = await useCase.execute(makeRequest({
        type: 'Debit',
        amount: 50,
        status: 'transaction.status.completed',
      }));

      expect(result.isRight()).toBe(true);
      expect(envelopeRepo.adjustAmount).toHaveBeenCalledWith('env-uuid', -50, 2026, 3);
    });

    it('deve usar referenceYear e referenceMonth do envelope ao criar compra com data de outro mês', async () => {
      envelopeRepo.getById.mockResolvedValue({ id: 'env-uuid' });
      envelopeRepo.getAmount.mockResolvedValueOnce(500);
      transactionsRepo.create.mockResolvedValue(undefined);

      const result = await useCase.execute(makeRequest({
        type: 'Debit',
        amount: 100,
        date: '2026-11-20' as any,
        referenceYear: 2026,
        referenceMonth: 12,
        status: 'transaction.status.completed',
      }));

      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        const created = result.value.getValue();
        expect(created.referenceYear).toBe(2026);
        expect(created.referenceMonth).toBe(12);
      }
      expect(envelopeRepo.getAmount).toHaveBeenCalledWith('env-uuid', 2026, 12);
      expect(envelopeRepo.adjustAmount).toHaveBeenCalledWith('env-uuid', -100, 2026, 12);
    });

    it('deve criar Credit e ajustar envelope amount atomicamente com delta positivo quando status=completed', async () => {
      envelopeRepo.getById.mockResolvedValue({ id: 'env-uuid' });
      transactionsRepo.create.mockResolvedValue(undefined);

      const result = await useCase.execute(makeRequest({
        type: 'Credit',
        amount: 50,
        status: 'transaction.status.completed',
      }));

      expect(result.isRight()).toBe(true);
      expect(envelopeRepo.adjustAmount).toHaveBeenCalledWith('env-uuid', 50, 2026, 3);
    });
  });
});
