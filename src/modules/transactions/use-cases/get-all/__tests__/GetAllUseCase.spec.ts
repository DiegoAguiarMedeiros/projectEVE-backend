import { GetAllUseCase } from '../GetAllUseCase';
import { Interface as ITransactionsRepo } from '../../../repos/Interface';
import { makeTransactionStub } from '../../../../../shared/test-utils/makeTransactionStub';

const makeTransactionsRepo = (): jest.Mocked<Pick<ITransactionsRepo, 'getAll'>> => ({
  getAll: jest.fn(),
});

const makeRequest = (overrides = {}) => ({
  id: 'user-123',
  page: 1,
  pageSize: 10,
  orderBy: 'date',
  order: 'DESC',
  ...overrides,
});

describe('GetAllUseCase', () => {
  let useCase: GetAllUseCase;
  let repo: jest.Mocked<any>;

  beforeEach(() => {
    repo = makeTransactionsRepo();
    useCase = new GetAllUseCase(repo);
  });

  describe('success', () => {
    it('deve retornar paginação com transações', async () => {
      const transactions = [makeTransactionStub(), makeTransactionStub({ id: 'tx-uuid-2' })];
      repo.getAll
        .mockResolvedValueOnce(transactions) // paginated
        .mockResolvedValueOnce(transactions); // total count

      const result = await useCase.execute(makeRequest());

      expect(result.isRight()).toBe(true);
      const pagination = result.value.getValue() as any;
      expect(pagination.data).toHaveLength(2);
      expect(pagination.totalItems).toBe(2);
    });

    it('deve calcular totalPages corretamente', async () => {
      const transactions = Array.from({ length: 15 }, (_, i) =>
        makeTransactionStub({ id: `tx-${i}` })
      );
      repo.getAll
        .mockResolvedValueOnce(transactions.slice(0, 10))
        .mockResolvedValueOnce(transactions);

      const result = await useCase.execute(makeRequest({ pageSize: 10 }));

      expect(result.isRight()).toBe(true);
      expect((result.value.getValue() as any).totalPages).toBe(2);
    });

    it('deve retornar paginação vazia quando não há transações', async () => {
      repo.getAll.mockResolvedValue([]);

      const result = await useCase.execute(makeRequest());

      expect(result.isRight()).toBe(true);
      expect((result.value.getValue() as any).totalItems).toBe(0);
    });
  });
});
