import { GetUpcomingPendingTransactionUseCase } from '../GetUpcomingPendingTransactionUseCase';
import { Interface as ITransactionsRepo } from '../../../repos/Interface';
import { makeTransactionStub } from '../../../../../shared/test-utils/makeTransactionStub';

const makeTransactionsRepo = (): jest.Mocked<Pick<ITransactionsRepo, 'getUpcomingPendingTransaction'>> => ({
  getUpcomingPendingTransaction: jest.fn(),
});

const makeRequest = (overrides = {}) => ({
  id: 'user-123',
  page: 1,
  pageSize: 10,
  orderBy: 'date',
  order: 'ASC',
  ...overrides,
});

describe('GetUpcomingPendingTransactionUseCase', () => {
  let useCase: GetUpcomingPendingTransactionUseCase;
  let repo: jest.Mocked<any>;

  beforeEach(() => {
    repo = makeTransactionsRepo();
    useCase = new GetUpcomingPendingTransactionUseCase(repo);
  });

  describe('success', () => {
    it('deve retornar paginação de transações pendentes futuras', async () => {
      const transactions = [
        makeTransactionStub({ status: 'transaction.status.pending' }),
        makeTransactionStub({ id: 'tx-2', status: 'transaction.status.pending' }),
      ];
      repo.getUpcomingPendingTransaction
        .mockResolvedValueOnce(transactions) // paginated
        .mockResolvedValueOnce(transactions); // total count

      const result = await useCase.execute(makeRequest());

      expect(result.isRight()).toBe(true);
      const pagination = result.value.getValue() as any;
      expect(pagination.data).toHaveLength(2);
      expect(pagination.totalItems).toBe(2);
    });

    it('deve filtrar por ano e mês quando informados', async () => {
      repo.getUpcomingPendingTransaction.mockResolvedValue([]);

      await useCase.execute(makeRequest({ year: 2026, month: 4 }));

      expect(repo.getUpcomingPendingTransaction).toHaveBeenCalledWith(
        'user-123', 1, 10, 'date', 'ASC', 2026, 4
      );
    });

    it('deve retornar lista vazia quando não há transações pendentes', async () => {
      repo.getUpcomingPendingTransaction.mockResolvedValue([]);

      const result = await useCase.execute(makeRequest());

      expect(result.isRight()).toBe(true);
      expect((result.value.getValue() as any).totalItems).toBe(0);
    });
  });
});
