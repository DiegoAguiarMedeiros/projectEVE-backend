import { DeleteAllByEnvelopeUseCase } from '../DeleteAllByEnvelopeUseCase';
import { Interface as ITransactionsRepo } from '../../../repos/Interface';
import { AppError } from '../../../../../shared/core/AppError';
import { makeTransactionStub } from '../../../../../shared/test-utils/makeTransactionStub';

const makeTransactionsRepo = (): jest.Mocked<Pick<ITransactionsRepo, 'getAllByEnvelope'>> => ({
  getAllByEnvelope: jest.fn(),
});

const makeDeleteUseCase = () => ({
  execute: jest.fn(),
});

const makeRequest = (overrides = {}) => ({
  envelopeId: 'env-uuid',
  userId: 'user-123',
  year: 2026,
  month: 3,
  ...overrides,
});

describe('DeleteAllByEnvelopeUseCase', () => {
  let useCase: DeleteAllByEnvelopeUseCase;
  let transactionsRepo: jest.Mocked<any>;
  let deleteUseCase: ReturnType<typeof makeDeleteUseCase>;

  beforeEach(() => {
    transactionsRepo = makeTransactionsRepo();
    deleteUseCase = makeDeleteUseCase();
    useCase = new DeleteAllByEnvelopeUseCase(transactionsRepo, deleteUseCase as any);
  });

  describe('errors', () => {
    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      transactionsRepo.getAllByEnvelope.mockRejectedValue(new Error('DB error'));

      const result = await useCase.execute(makeRequest());

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve deletar todas as transações do envelope', async () => {
      const transactions = [
        makeTransactionStub({ id: 'tx-1' }),
        makeTransactionStub({ id: 'tx-2' }),
      ];
      transactionsRepo.getAllByEnvelope.mockResolvedValue(transactions);
      deleteUseCase.execute.mockResolvedValue({ isRight: () => true });

      const result = await useCase.execute(makeRequest());

      expect(result.isRight()).toBe(true);
      expect(deleteUseCase.execute).toHaveBeenCalledTimes(2);
    });

    it('deve ignorar transações com paymentMethod Reallocation', async () => {
      const transactions = [
        makeTransactionStub({ id: 'tx-1' }),
        makeTransactionStub({ id: 'tx-2', paymentMethod: 'envelope.transaction.payment_method.Reallocation' }),
      ];
      transactionsRepo.getAllByEnvelope.mockResolvedValue(transactions);
      deleteUseCase.execute.mockResolvedValue({ isRight: () => true });

      const result = await useCase.execute(makeRequest());

      expect(result.isRight()).toBe(true);
      expect(deleteUseCase.execute).toHaveBeenCalledTimes(1);
      expect(deleteUseCase.execute).toHaveBeenCalledWith({ id: 'tx-1', userId: 'user-123' });
    });

    it('deve retornar sucesso com lista vazia sem chamar deleteUseCase', async () => {
      transactionsRepo.getAllByEnvelope.mockResolvedValue([]);

      const result = await useCase.execute(makeRequest());

      expect(result.isRight()).toBe(true);
      expect(deleteUseCase.execute).not.toHaveBeenCalled();
    });
  });
});
