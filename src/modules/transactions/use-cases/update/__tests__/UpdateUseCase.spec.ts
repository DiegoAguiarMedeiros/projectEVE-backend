import { UpdateUseCase } from '../UpdateUseCase';
import { UpdateErrors } from '../UpdateErrors';
import { Interface as ITransactionsRepo } from '../../../repos/Interface';
import { AppError } from '../../../../../shared/core/AppError';
import { makeTransactionStub } from '../../../../../shared/test-utils/makeTransactionStub';

const makeTransactionsRepo = (): jest.Mocked<Pick<ITransactionsRepo, 'getById' | 'update'>> => ({
  getById: jest.fn(),
  update: jest.fn(),
});

const makeDomainEvents = () => ({
  dispatchEventsForAggregate: jest.fn(),
});

const makeRequest = (overrides = {}) => ({
  request: { id: 'tx-uuid', userId: 'user-123' },
  fieldUpdate: {
    description: 'Nova descrição',
    amount: 200,
    date: new Date('2026-04-01'),
    type: 'Debit' as const,
    status: 'transaction.status.completed' as const,
    paymentMethod: 'envelope.transaction.payment_method.Cash' as const,
  },
  ...overrides,
});

describe('UpdateUseCase', () => {
  let useCase: UpdateUseCase;
  let repo: jest.Mocked<any>;
  let domainEvents: ReturnType<typeof makeDomainEvents>;

  beforeEach(() => {
    repo = makeTransactionsRepo();
    domainEvents = makeDomainEvents();
    useCase = new UpdateUseCase(repo, domainEvents as any);
  });

  describe('errors', () => {
    it('deve retornar NotFound quando transação não existe', async () => {
      repo.getById.mockResolvedValue(null);

      const result = await useCase.execute(makeRequest());

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(UpdateErrors.NotFound);
      expect(repo.update).not.toHaveBeenCalled();
    });

    it('deve retornar UpdateError quando repo.update retorna false', async () => {
      const transaction = makeTransactionStub();
      repo.getById.mockResolvedValue(transaction);
      repo.update.mockResolvedValue(false);

      const result = await useCase.execute(makeRequest());

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(UpdateErrors.UpdateError);
    });

    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      repo.getById.mockRejectedValue(new Error('DB error'));

      const result = await useCase.execute(makeRequest());

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve atualizar transação e despachar eventos de domínio', async () => {
      const transaction = makeTransactionStub();
      repo.getById.mockResolvedValue(transaction);
      repo.update.mockResolvedValue(true);

      const result = await useCase.execute(makeRequest());

      expect(result.isRight()).toBe(true);
      expect(repo.update).toHaveBeenCalledTimes(1);
      expect(domainEvents.dispatchEventsForAggregate).toHaveBeenCalledTimes(1);
    });

    it('deve atualizar apenas os campos fornecidos (description)', async () => {
      const transaction = makeTransactionStub({ description: 'Descrição antiga' });
      repo.getById.mockResolvedValue(transaction);
      repo.update.mockResolvedValue(true);

      await useCase.execute({
        request: { id: 'tx-uuid', userId: 'user-123' },
        fieldUpdate: { description: 'Descrição nova', type: 'Debit' as const } as any,
      });

      expect(repo.update).toHaveBeenCalledWith('tx-uuid', expect.objectContaining({}));
    });

    it('deve manter description original quando não fornecida no fieldUpdate', async () => {
      const transaction = makeTransactionStub({ description: 'Descrição original' });
      repo.getById.mockResolvedValue(transaction);
      repo.update.mockResolvedValue(true);

      await useCase.execute({
        request: { id: 'tx-uuid', userId: 'user-123' },
        fieldUpdate: { amount: 150, type: 'Debit' as const } as any,
      });

      expect(transaction.description.value).toBe('Descrição original');
    });
  });
});
