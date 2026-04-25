import { GetAllUseCase } from '../GetAllUseCase';
import { Interface as IGoalsRepo } from '../../../repos/Interface';
import { GoalsMap } from '../../../mappers';

const makeGoalsRepo = (): jest.Mocked<IGoalsRepo> => ({
  getAll: jest.fn(),
  create: jest.fn(),
  getById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  deleteAll: jest.fn(),
});

const makeGoal = () => GoalsMap.toDomain({
  id: 'goal-uuid',
  envelope_id: 'env-uuid',
  description: 'Comprar carro',
  amount: 500,
  amount_total: 50000,
  percentage: 1,
  deadline: new Date('2030-01-01'),
});

const makeRequest = (overrides = {}) => ({
  id: 'user-uuid',
  page: 1,
  pageSize: 10,
  orderBy: 'description',
  order: 'ASC',
  ...overrides,
});

describe('GetAllGoalsUseCase', () => {
  let useCase: GetAllUseCase;
  let repo: jest.Mocked<IGoalsRepo>;

  beforeEach(() => {
    repo = makeGoalsRepo();
    useCase = new GetAllUseCase(repo);
  });

  describe('success', () => {
    it('deve retornar página com goals', async () => {
      const goal = makeGoal();
      repo.getAll
        .mockResolvedValueOnce([goal])
        .mockResolvedValueOnce([goal]);
      const result = await useCase.execute(makeRequest());
      expect(result.isRight()).toBe(true);
      const pagination = (result.value as any).getValue();
      expect(pagination.data).toHaveLength(1);
      expect(pagination.totalItems).toBe(1);
    });

    it('deve retornar página vazia quando não há goals', async () => {
      repo.getAll.mockResolvedValue([]);
      const result = await useCase.execute(makeRequest());
      expect(result.isRight()).toBe(true);
      const pagination = (result.value as any).getValue();
      expect(pagination.data).toHaveLength(0);
    });

    it('deve calcular totalPages corretamente', async () => {
      const goals = [makeGoal(), makeGoal(), makeGoal()];
      repo.getAll
        .mockResolvedValueOnce(goals.slice(0, 2))
        .mockResolvedValueOnce(goals);
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
