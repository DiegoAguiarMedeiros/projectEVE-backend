import { GetAllUseCase } from '../GetAllUseCase';
import { Interface as IIncomesRepo } from '../../../repos/Interface';
import { IncomesMap } from '../../../mappers';

const makeRepo = (): jest.Mocked<IIncomesRepo> => ({
  getAll: jest.fn(),
  create: jest.fn(),
  getById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  getTotal: jest.fn(),
  deleteAll: jest.fn(),
});

const makeIncome = () => IncomesMap.toDomain({
  id: 'income-uuid',
  user_id: 'user-uuid',
  description: 'Salário mensal',
  amount: 5000,
  payment_day: 5,
});

const makeRequest = (overrides = {}) => ({
  id: 'user-uuid',
  page: 1,
  pageSize: 10,
  orderBy: 'description',
  order: 'ASC',
  ...overrides,
});

describe('GetAllUseCase', () => {
  let useCase: GetAllUseCase;
  let repo: jest.Mocked<IIncomesRepo>;

  beforeEach(() => {
    repo = makeRepo();
    useCase = new GetAllUseCase(repo);
  });

  describe('success', () => {
    it('deve retornar página com incomes', async () => {
      const income = makeIncome();
      repo.getAll
        .mockResolvedValueOnce([income])  // chamada paginada
        .mockResolvedValueOnce([income]); // chamada para total
      const result = await useCase.execute(makeRequest());
      expect(result.isRight()).toBe(true);
      const pagination = (result.value as any).getValue();
      expect(pagination.data).toHaveLength(1);
      expect(pagination.totalItems).toBe(1);
    });

    it('deve retornar página vazia quando não há incomes', async () => {
      repo.getAll.mockResolvedValue([]);
      const result = await useCase.execute(makeRequest());
      expect(result.isRight()).toBe(true);
      const pagination = (result.value as any).getValue();
      expect(pagination.data).toHaveLength(0);
      expect(pagination.totalItems).toBe(0);
    });

    it('deve calcular totalPages corretamente', async () => {
      const incomes = Array.from({ length: 3 }, () => makeIncome());
      repo.getAll
        .mockResolvedValueOnce(incomes.slice(0, 2))
        .mockResolvedValueOnce(incomes);
      const result = await useCase.execute(makeRequest({ pageSize: 2 }));
      expect(result.isRight()).toBe(true);
      const pagination = (result.value as any).getValue();
      expect(pagination.totalPages).toBe(2);
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
