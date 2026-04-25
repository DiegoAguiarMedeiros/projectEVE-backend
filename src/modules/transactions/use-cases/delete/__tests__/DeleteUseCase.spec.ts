import { DeleteUseCase } from '../DeleteUseCase';
import { DeleteErrors } from '../DeleteErrors';
import { Interface as ITransactionsRepo } from '../../../repos/Interface';
import { AppError } from '../../../../../shared/core/AppError';
import { makeTransactionStub } from '../../../../../shared/test-utils/makeTransactionStub';

const makeTransactionsRepo = (): jest.Mocked<Pick<ITransactionsRepo, 'getById' | 'delete'>> => ({
  getById: jest.fn(),
  delete: jest.fn(),
});

const makeEnvelopeRepo = () => ({
  getAmount: jest.fn(),
  addAmount: jest.fn(),
});

const makeRequest = (overrides = {}) => ({
  id: 'tx-uuid',
  userId: 'user-123',
  ...overrides,
});

describe('DeleteUseCase', () => {
  let useCase: DeleteUseCase;
  let transactionsRepo: jest.Mocked<any>;
  let envelopeRepo: ReturnType<typeof makeEnvelopeRepo>;

  beforeEach(() => {
    transactionsRepo = makeTransactionsRepo();
    envelopeRepo = makeEnvelopeRepo();
    useCase = new DeleteUseCase(transactionsRepo, envelopeRepo as any);
  });

  describe('errors', () => {
    it('deve retornar NotFound quando transação não existe', async () => {
      transactionsRepo.getById.mockResolvedValue(null);

      const result = await useCase.execute(makeRequest());

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(DeleteErrors.NotFound);
      expect(transactionsRepo.delete).not.toHaveBeenCalled();
    });

    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      transactionsRepo.getById.mockRejectedValue(new Error('DB error'));

      const result = await useCase.execute(makeRequest());

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve deletar transação pending sem reverter envelope', async () => {
      const transaction = makeTransactionStub({ status: 'transaction.status.pending' });
      transactionsRepo.getById.mockResolvedValue(transaction);
      transactionsRepo.delete.mockResolvedValue(undefined);

      const result = await useCase.execute(makeRequest());

      expect(result.isRight()).toBe(true);
      expect(transactionsRepo.delete).toHaveBeenCalledWith('tx-uuid');
      expect(envelopeRepo.addAmount).not.toHaveBeenCalled();
    });

    it('deve reverter envelope ao deletar transação Debit completed', async () => {
      const transaction = makeTransactionStub({
        status: 'transaction.status.completed',
        type: 'Debit',
        amount: 100,
      });
      transactionsRepo.getById.mockResolvedValue(transaction);
      transactionsRepo.delete.mockResolvedValue(undefined);
      envelopeRepo.getAmount.mockResolvedValue(300);

      const result = await useCase.execute(makeRequest());

      expect(result.isRight()).toBe(true);
      expect(envelopeRepo.addAmount).toHaveBeenCalledWith('env-uuid', 400, 2026, 3);
      expect(transactionsRepo.delete).toHaveBeenCalledWith('tx-uuid');
    });

    it('deve reverter envelope ao deletar transação Credit completed', async () => {
      const transaction = makeTransactionStub({
        status: 'transaction.status.completed',
        type: 'Credit',
        amount: 100,
      });
      transactionsRepo.getById.mockResolvedValue(transaction);
      transactionsRepo.delete.mockResolvedValue(undefined);
      envelopeRepo.getAmount.mockResolvedValue(500);

      const result = await useCase.execute(makeRequest());

      expect(result.isRight()).toBe(true);
      expect(envelopeRepo.addAmount).toHaveBeenCalledWith('env-uuid', 400, 2026, 3);
    });

    it('não deve chamar addAmount quando envelopeAmount é falsy', async () => {
      const transaction = makeTransactionStub({
        status: 'transaction.status.completed',
        type: 'Debit',
        amount: 100,
      });
      transactionsRepo.getById.mockResolvedValue(transaction);
      transactionsRepo.delete.mockResolvedValue(undefined);
      envelopeRepo.getAmount.mockResolvedValue(null);

      const result = await useCase.execute(makeRequest());

      expect(result.isRight()).toBe(true);
      expect(envelopeRepo.addAmount).not.toHaveBeenCalled();
    });
  });
});
