import { GetAllByEnvelopeUseCase } from '../GetAllByEnvelopeUseCase';
import { Interface as ITransactionsRepo } from '../../../repos/Interface';
import { makeTransactionStub } from '../../../../../shared/test-utils/makeTransactionStub';

const makeTransactionsRepo = (): jest.Mocked<Pick<ITransactionsRepo, 'getAllByEnvelope'>> => ({
  getAllByEnvelope: jest.fn(),
});

const makeRequest = (overrides = {}) => ({
  id: 'user-123',
  envelope: 'env-uuid',
  year: 2026,
  month: 3,
  page: 1,
  pageSize: 10,
  orderBy: 'date',
  order: 'DESC',
  ...overrides,
});

describe('GetAllByEnvelopeUseCase', () => {
  let useCase: GetAllByEnvelopeUseCase;
  let repo: jest.Mocked<any>;

  beforeEach(() => {
    repo = makeTransactionsRepo();
    useCase = new GetAllByEnvelopeUseCase(repo);
  });

  describe('success', () => {
    it('deve retornar paginação filtrada por envelope', async () => {
      const transactions = [makeTransactionStub(), makeTransactionStub({ id: 'tx-2' })];
      repo.getAllByEnvelope
        .mockResolvedValueOnce(transactions) // paginated
        .mockResolvedValueOnce(transactions); // total count

      const result = await useCase.execute(makeRequest());

      expect(result.isRight()).toBe(true);
      const pagination = result.value.getValue() as any;
      expect(pagination.data).toHaveLength(2);
      expect(pagination.totalItems).toBe(2);
    });

    it('deve filtrar por tipo quando informado', async () => {
      const debitTransactions = [makeTransactionStub({ type: 'Debit' })];
      repo.getAllByEnvelope
        .mockResolvedValueOnce(debitTransactions)
        .mockResolvedValueOnce(debitTransactions);

      const result = await useCase.execute(makeRequest({ type: 'Debit' }));

      expect(result.isRight()).toBe(true);
      expect(repo.getAllByEnvelope).toHaveBeenCalledWith(
        'user-123', 'env-uuid', 2026, 3, 1, 10, 'date', 'DESC', 'Debit'
      );
    });

    it('deve retornar lista vazia quando envelope não tem transações', async () => {
      repo.getAllByEnvelope.mockResolvedValue([]);

      const result = await useCase.execute(makeRequest());

      expect(result.isRight()).toBe(true);
      expect((result.value.getValue() as any).totalItems).toBe(0);
    });
  });
});
