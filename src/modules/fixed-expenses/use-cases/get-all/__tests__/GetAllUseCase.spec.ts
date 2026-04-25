import { GetAllUseCase } from '../GetAllUseCase';
import { Interface as IFixedExpenseRepo } from '../../../repos/Interface';
import { FixedExpenseMap } from '../../../mappers';

const makeRepo = (): jest.Mocked<IFixedExpenseRepo> => ({
  getAll: jest.fn(),
  create: jest.fn(),
  getById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  deleteAll: jest.fn(),
  getTotalByEnvelope: jest.fn(),
});

const makeFE = () => FixedExpenseMap.toDomain({
  id: 'fe-uuid',
  envelope_id: 'env-uuid',
  description: 'Conta de internet',
  amount: 120,
  payment_day: 10,
});

const makeRequest = (overrides = {}) => ({
  id: 'user-uuid',
  page: 1,
  pageSize: 10,
  orderBy: 'description',
  order: 'ASC',
  ...overrides,
});

describe('GetAllFixedExpensesUseCase', () => {
  let useCase: GetAllUseCase;
  let repo: jest.Mocked<IFixedExpenseRepo>;

  beforeEach(() => {
    repo = makeRepo();
    useCase = new GetAllUseCase(repo);
  });

  describe('success', () => {
    it('deve retornar página com fixed expenses', async () => {
      const fe = makeFE();
      repo.getAll
        .mockResolvedValueOnce([fe])
        .mockResolvedValueOnce([fe]);
      const result = await useCase.execute(makeRequest());
      expect(result.isRight()).toBe(true);
      const pagination = (result.value as any).getValue();
      expect(pagination.data).toHaveLength(1);
      expect(pagination.totalItems).toBe(1);
    });

    it('deve retornar página vazia quando não há fixed expenses', async () => {
      repo.getAll.mockResolvedValue([]);
      const result = await useCase.execute(makeRequest());
      expect(result.isRight()).toBe(true);
      const pagination = (result.value as any).getValue();
      expect(pagination.data).toHaveLength(0);
    });
  });

  describe('errors', () => {
    it('deve retornar falha quando currentPage é negativo', async () => {
      repo.getAll.mockResolvedValue([]);
      const result = await useCase.execute(makeRequest({ page: -1 }));
      expect(result.isLeft()).toBe(true);
    });
  });
});
