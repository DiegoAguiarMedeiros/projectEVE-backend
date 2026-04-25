import { TransferEnvelopeBalanceUseCase } from '../TransferEnvelopeBalanceUseCase';
import { TransferEnvelopeBalanceErrors } from '../TransferEnvelopeBalanceErrors';
import { AppError } from '../../../../../shared/core/AppError';
import { Interface as IEnvelopeRepo } from '../../../repos/Interface';
import { EnvelopesMap } from '../../../mappers';
import { right, Result } from '../../../../../shared/core/Result';

const makeEnvelopeRepo = (): jest.Mocked<Pick<IEnvelopeRepo, 'getById' | 'getAmount'>> => ({
  getById: jest.fn(),
  getAmount: jest.fn(),
});

const makeCreateTransactionUseCase = () => ({
  execute: jest.fn(),
});

const makeEnvelope = (name = 'Alimentação') => EnvelopesMap.toDomain({
  id: name === 'Lazer' ? 'to-env-uuid' : 'from-env-uuid',
  name,
  color: '#ff5733',
  order: 1,
  percentage: 30,
  user_id: 'user-uuid',
  EnvelopesAmounts: [],
});

const makeRequest = (overrides = {}) => ({
  userId: 'user-uuid',
  fromEnvelopeId: 'from-env-uuid',
  toEnvelopeId: 'to-env-uuid',
  amount: 100,
  year: 2026,
  month: 3,
  ...overrides,
});

describe('TransferEnvelopeBalanceUseCase', () => {
  let useCase: TransferEnvelopeBalanceUseCase;
  let envelopeRepo: jest.Mocked<any>;
  let createTransactionUseCase: jest.Mocked<any>;

  beforeEach(() => {
    envelopeRepo = makeEnvelopeRepo();
    createTransactionUseCase = makeCreateTransactionUseCase();
    useCase = new TransferEnvelopeBalanceUseCase(envelopeRepo as any, createTransactionUseCase as any);
  });

  describe('errors', () => {
    it('deve retornar InvalidTransferError quando amount é zero', async () => {
      const result = await useCase.execute(makeRequest({ amount: 0 }));
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(TransferEnvelopeBalanceErrors.InvalidTransferError);
    });

    it('deve retornar InvalidTransferError quando amount é negativo', async () => {
      const result = await useCase.execute(makeRequest({ amount: -50 }));
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(TransferEnvelopeBalanceErrors.InvalidTransferError);
    });

    it('deve retornar InvalidTransferError quando from e to são o mesmo envelope', async () => {
      const result = await useCase.execute(makeRequest({ fromEnvelopeId: 'same', toEnvelopeId: 'same' }));
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(TransferEnvelopeBalanceErrors.InvalidTransferError);
    });

    it('deve retornar EnvelopeNotFoundError quando envelope de origem não existe', async () => {
      envelopeRepo.getById.mockResolvedValue(null);
      const result = await useCase.execute(makeRequest());
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(TransferEnvelopeBalanceErrors.EnvelopeNotFoundError);
    });

    it('deve retornar EnvelopeNotFoundError quando envelope de destino não existe', async () => {
      envelopeRepo.getById
        .mockResolvedValueOnce(makeEnvelope('Alimentação'))
        .mockResolvedValueOnce(null);
      envelopeRepo.getAmount.mockResolvedValue(500);
      const result = await useCase.execute(makeRequest());
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(TransferEnvelopeBalanceErrors.EnvelopeNotFoundError);
    });

    it('deve retornar InsufficientFundsError quando saldo é insuficiente', async () => {
      envelopeRepo.getById
        .mockResolvedValueOnce(makeEnvelope('Alimentação'))
        .mockResolvedValueOnce(makeEnvelope('Lazer'));
      envelopeRepo.getAmount.mockResolvedValue(50);
      const result = await useCase.execute(makeRequest({ amount: 100 }));
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(TransferEnvelopeBalanceErrors.InsufficientFundsError);
    });

    it('deve retornar UnexpectedError quando createTransactionUseCase lança exceção', async () => {
      envelopeRepo.getById
        .mockResolvedValueOnce(makeEnvelope('Alimentação'))
        .mockResolvedValueOnce(makeEnvelope('Lazer'));
      envelopeRepo.getAmount.mockResolvedValue(500);
      createTransactionUseCase.execute.mockRejectedValue(new Error('DB offline'));
      const result = await useCase.execute(makeRequest());
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve realizar transferência com sucesso criando 2 transações', async () => {
      envelopeRepo.getById
        .mockResolvedValueOnce(makeEnvelope('Alimentação'))
        .mockResolvedValueOnce(makeEnvelope('Lazer'));
      envelopeRepo.getAmount.mockResolvedValue(500);
      createTransactionUseCase.execute.mockResolvedValue(right(Result.ok<void>()));

      const result = await useCase.execute(makeRequest());
      expect(result.isRight()).toBe(true);
      expect(createTransactionUseCase.execute).toHaveBeenCalledTimes(2);
    });

    it('deve criar transação de débito para envelope de origem e crédito para destino', async () => {
      envelopeRepo.getById
        .mockResolvedValueOnce(makeEnvelope('Alimentação'))
        .mockResolvedValueOnce(makeEnvelope('Lazer'));
      envelopeRepo.getAmount.mockResolvedValue(500);
      createTransactionUseCase.execute.mockResolvedValue(right(Result.ok<void>()));

      await useCase.execute(makeRequest());

      const [debitCall, creditCall] = createTransactionUseCase.execute.mock.calls;
      expect(debitCall[0].type).toBe('Debit');
      expect(debitCall[0].envelopeId).toBe('from-env-uuid');
      expect(creditCall[0].type).toBe('Credit');
      expect(creditCall[0].envelopeId).toBe('to-env-uuid');
    });
  });
});
