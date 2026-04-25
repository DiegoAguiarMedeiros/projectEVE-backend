import { GetByIdUseCase } from '../GetByIdUseCase';
import { GetByIdErrors } from '../GetByIdErrors';
import { Interface as ITransactionsRepo } from '../../../repos/Interface';
import { makeTransactionStub } from '../../../../../shared/test-utils/makeTransactionStub';

const makeTransactionsRepo = (): jest.Mocked<Pick<ITransactionsRepo, 'getById'>> => ({
  getById: jest.fn(),
});

describe('GetByIdUseCase', () => {
  let useCase: GetByIdUseCase;
  let repo: jest.Mocked<any>;

  beforeEach(() => {
    repo = makeTransactionsRepo();
    useCase = new GetByIdUseCase(repo);
  });

  describe('errors', () => {
    it('deve retornar NotFound quando transação não existe', async () => {
      repo.getById.mockResolvedValue(null);

      const result = await useCase.execute({ id: 'tx-uuid', userId: 'user-123' });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(GetByIdErrors.NotFound);
    });
  });

  describe('success', () => {
    it('deve retornar a transação quando encontrada', async () => {
      const transaction = makeTransactionStub();
      repo.getById.mockResolvedValue(transaction);

      const result = await useCase.execute({ id: 'tx-uuid', userId: 'user-123' });

      expect(result.isRight()).toBe(true);
      expect(repo.getById).toHaveBeenCalledWith('tx-uuid', 'user-123');
    });
  });
});
