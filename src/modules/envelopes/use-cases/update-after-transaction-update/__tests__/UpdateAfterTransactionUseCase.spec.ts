import { Update } from '../Update';
import { UpdateErrors } from '../UpdateErrors';
import { AppError } from '../../../../../shared/core/AppError';
import { TransactionsMap } from '../../../../transactions/mappers';
import { right, Result } from '../../../../../shared/core/Result';

const makeEnvelopeRepo = () => ({
  getAmount: jest.fn(),
});

const makeTransactionRepo = () => ({
  getById: jest.fn(),
});

const makeUpdateEnvelopeAmount = () => ({
  execute: jest.fn(),
});

const rawTx = {
  id: 'tx-uuid',
  envelope_id: 'env-uuid',
  description: 'Compra no mercado',
  amount: 150,
  date: '2026-03-01T00:00:00.000Z',
  type: 'Debit',
  status: 'transaction.status.completed',
  payment_method: 'envelope.transaction.payment_method.Pix',
  processed_incomes_id: null,
  credit_card_id: null,
  debt_id: null,
  credit_card_name: null,
  is_translatable: false,
};

describe('UpdateAfterTransactionUseCase', () => {
  let useCase: Update;
  let envelopeRepo: ReturnType<typeof makeEnvelopeRepo>;
  let transactionRepo: ReturnType<typeof makeTransactionRepo>;
  let updateEnvelopeAmount: ReturnType<typeof makeUpdateEnvelopeAmount>;

  beforeEach(() => {
    envelopeRepo = makeEnvelopeRepo();
    transactionRepo = makeTransactionRepo();
    updateEnvelopeAmount = makeUpdateEnvelopeAmount();
    useCase = new Update(envelopeRepo as any, transactionRepo as any, updateEnvelopeAmount as any);
  });

  const makeRequest = (overrides = {}) => ({
    transactionId: 'tx-uuid',
    oldAmount: 100,
    newAmount: 150,
    oldStatus: 'transaction.status.completed',
    userId: 'user-uuid',
    ...overrides,
  });

  describe('errors', () => {
    it('deve retornar TransactionNotFound quando transação não existe', async () => {
      transactionRepo.getById.mockResolvedValue(null);
      const result = await useCase.execute(makeRequest());
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(UpdateErrors.TransactionNotFound);
    });

    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      transactionRepo.getById.mockRejectedValue(new Error('DB offline'));
      const result = await useCase.execute(makeRequest());
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve retornar sucesso quando envelope amount é null (sem amount no mês)', async () => {
      transactionRepo.getById.mockResolvedValue(TransactionsMap.toDomain(rawTx));
      envelopeRepo.getAmount.mockResolvedValue(null);

      const result = await useCase.execute(makeRequest());
      expect(result.isRight()).toBe(true);
      expect(updateEnvelopeAmount.execute).not.toHaveBeenCalled();
    });

    it('deve chamar updateEnvelopeAmount quando delta é diferente de zero', async () => {
      transactionRepo.getById.mockResolvedValue(TransactionsMap.toDomain(rawTx));
      envelopeRepo.getAmount.mockResolvedValue(1000);
      updateEnvelopeAmount.execute.mockResolvedValue(right(Result.ok<void>()));

      const result = await useCase.execute(makeRequest({ oldAmount: 100, newAmount: 150 }));
      expect(result.isRight()).toBe(true);
      expect(updateEnvelopeAmount.execute).toHaveBeenCalledTimes(1);
    });

    it('não deve chamar updateEnvelopeAmount quando delta é zero (mesmos valores)', async () => {
      const pendingTx = { ...rawTx, status: 'transaction.status.pending' };
      transactionRepo.getById.mockResolvedValue(TransactionsMap.toDomain(pendingTx));
      envelopeRepo.getAmount.mockResolvedValue(1000);

      const result = await useCase.execute(makeRequest({
        oldStatus: 'transaction.status.pending',
        oldAmount: 150,
        newAmount: 150,
      }));
      expect(result.isRight()).toBe(true);
      expect(updateEnvelopeAmount.execute).not.toHaveBeenCalled();
    });
  });
});
