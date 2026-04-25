import { UpdateStatusUseCase } from '../UpdateStatusUseCase';
import { UpdateStatusErrors } from '../UpdateStatusErrors';
import { Interface as ITransactionsRepo } from '../../../repos/Interface';
import { Interface as IEnvelopeRepo } from '../../../../envelopes/repos/Interface';
import { Interface as IDebtRepo } from '../../../../debts/repos/Interface';
import { AppError } from '../../../../../shared/core/AppError';
import { makeTransactionStub } from '../../../../../shared/test-utils/makeTransactionStub';

const makeTransactionsRepo = (): jest.Mocked<Pick<ITransactionsRepo, 'getById' | 'updateStatus'>> => ({
  getById: jest.fn(),
  updateStatus: jest.fn(),
});

const makeEnvelopeRepo = (): jest.Mocked<Pick<IEnvelopeRepo, 'getAmount' | 'addAmount' | 'createAmount'>> => ({
  getAmount: jest.fn(),
  addAmount: jest.fn(),
  createAmount: jest.fn(),
});

const makeDebtRepo = (): jest.Mocked<Pick<IDebtRepo, 'updateInstallmentsPaid'>> => ({
  updateInstallmentsPaid: jest.fn(),
});

const makeRequest = (status: any = 'transaction.status.completed') => ({
  request: { id: 'tx-uuid', userId: 'user-123' },
  fieldUpdate: { status },
});

describe('UpdateStatusUseCase', () => {
  let useCase: UpdateStatusUseCase;
  let transactionsRepo: jest.Mocked<any>;
  let envelopeRepo: jest.Mocked<any>;
  let debtRepo: jest.Mocked<any>;

  beforeEach(() => {
    transactionsRepo = makeTransactionsRepo();
    envelopeRepo = makeEnvelopeRepo();
    debtRepo = makeDebtRepo();
    useCase = new UpdateStatusUseCase(transactionsRepo, envelopeRepo as any, debtRepo as any);
  });

  describe('errors', () => {
    it('deve retornar NotFound quando transação não existe', async () => {
      transactionsRepo.getById.mockResolvedValue(null);

      const result = await useCase.execute(makeRequest());

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(UpdateStatusErrors.NotFound);
      expect(transactionsRepo.updateStatus).not.toHaveBeenCalled();
    });

    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      transactionsRepo.getById.mockRejectedValue(new Error('DB error'));

      const result = await useCase.execute(makeRequest());

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('não deve alterar envelope quando status não muda', async () => {
      const transaction = makeTransactionStub({ status: 'transaction.status.completed' });
      transactionsRepo.getById.mockResolvedValue(transaction);
      transactionsRepo.updateStatus.mockResolvedValue(true);

      const result = await useCase.execute(makeRequest('transaction.status.completed'));

      expect(result.isRight()).toBe(true);
      expect(envelopeRepo.addAmount).not.toHaveBeenCalled();
      expect(envelopeRepo.createAmount).not.toHaveBeenCalled();
    });

    it('deve deduzir do envelope quando Debit muda para completed (envelope existe)', async () => {
      const transaction = makeTransactionStub({
        status: 'transaction.status.pending',
        type: 'Debit',
        amount: 100,
      });
      transactionsRepo.getById.mockResolvedValue(transaction);
      transactionsRepo.updateStatus.mockResolvedValue(true);
      envelopeRepo.getAmount.mockResolvedValue(500);

      const result = await useCase.execute(makeRequest('transaction.status.completed'));

      expect(result.isRight()).toBe(true);
      expect(envelopeRepo.addAmount).toHaveBeenCalledWith('env-uuid', 400, 2026, 3);
    });

    it('deve creditar no envelope quando Credit muda para completed (envelope existe)', async () => {
      const transaction = makeTransactionStub({
        status: 'transaction.status.pending',
        type: 'Credit',
        amount: 100,
      });
      transactionsRepo.getById.mockResolvedValue(transaction);
      transactionsRepo.updateStatus.mockResolvedValue(true);
      envelopeRepo.getAmount.mockResolvedValue(200);

      const result = await useCase.execute(makeRequest('transaction.status.completed'));

      expect(result.isRight()).toBe(true);
      expect(envelopeRepo.addAmount).toHaveBeenCalledWith('env-uuid', 300, 2026, 3);
    });

    it('deve criar envelope amount quando Debit muda para completed e alocação não existe', async () => {
      const transaction = makeTransactionStub({
        status: 'transaction.status.pending',
        type: 'Debit',
        amount: 100,
      });
      transactionsRepo.getById.mockResolvedValue(transaction);
      transactionsRepo.updateStatus.mockResolvedValue(true);
      envelopeRepo.getAmount.mockResolvedValue(null);

      const result = await useCase.execute(makeRequest('transaction.status.completed'));

      expect(result.isRight()).toBe(true);
      expect(envelopeRepo.createAmount).toHaveBeenCalledWith('env-uuid', -100, 2026, 3);
    });

    it('deve reverter envelope quando Debit volta de completed para pending', async () => {
      const transaction = makeTransactionStub({
        status: 'transaction.status.completed',
        type: 'Debit',
        amount: 100,
      });
      transactionsRepo.getById.mockResolvedValue(transaction);
      transactionsRepo.updateStatus.mockResolvedValue(true);
      envelopeRepo.getAmount.mockResolvedValue(300);

      const result = await useCase.execute(makeRequest('transaction.status.pending'));

      expect(result.isRight()).toBe(true);
      expect(envelopeRepo.addAmount).toHaveBeenCalledWith('env-uuid', 400, 2026, 3);
    });

    it('deve incrementar installmentsPaid quando transação com debtId muda para completed', async () => {
      const transaction = makeTransactionStub({
        status: 'transaction.status.pending',
        debtId: 'debt-uuid',
        amount: 100,
      });
      transactionsRepo.getById.mockResolvedValue(transaction);
      transactionsRepo.updateStatus.mockResolvedValue(true);
      envelopeRepo.getAmount.mockResolvedValue(500);

      const result = await useCase.execute(makeRequest('transaction.status.completed'));

      expect(result.isRight()).toBe(true);
      expect(debtRepo.updateInstallmentsPaid).toHaveBeenCalledWith('debt-uuid', 1);
    });

    it('deve decrementar installmentsPaid quando transação com debtId volta para pending', async () => {
      const transaction = makeTransactionStub({
        status: 'transaction.status.completed',
        debtId: 'debt-uuid',
        amount: 100,
      });
      transactionsRepo.getById.mockResolvedValue(transaction);
      transactionsRepo.updateStatus.mockResolvedValue(true);
      envelopeRepo.getAmount.mockResolvedValue(500);

      const result = await useCase.execute(makeRequest('transaction.status.pending'));

      expect(result.isRight()).toBe(true);
      expect(debtRepo.updateInstallmentsPaid).toHaveBeenCalledWith('debt-uuid', -1);
    });

    it('não deve alterar installmentsPaid quando transação não tem debtId', async () => {
      const transaction = makeTransactionStub({
        status: 'transaction.status.pending',
        amount: 100,
      });
      transactionsRepo.getById.mockResolvedValue(transaction);
      transactionsRepo.updateStatus.mockResolvedValue(true);
      envelopeRepo.getAmount.mockResolvedValue(500);

      await useCase.execute(makeRequest('transaction.status.completed'));

      expect(debtRepo.updateInstallmentsPaid).not.toHaveBeenCalled();
    });
  });
});
