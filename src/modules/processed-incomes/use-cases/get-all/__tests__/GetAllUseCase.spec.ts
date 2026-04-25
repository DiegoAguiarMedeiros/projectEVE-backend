import { GetAllUseCase } from '../GetAllUseCase';
import { Interface as IProcessedIncomesRepo } from '../../../repos/Interface';
import { ProcessedIncomesMap } from '../../../mappers';

const makeRepo = (): jest.Mocked<Pick<IProcessedIncomesRepo, 'getAllByYearMonth'>> => ({
  getAllByYearMonth: jest.fn(),
});

const makePI = () => ProcessedIncomesMap.toDomain({
  id: 'pi-uuid',
  user_id: 'user-uuid',
  description: 'Processamento março',
  day: 5,
  month: 3,
  year: 2026,
  total_income_processed: 5000,
  processed_at: new Date('2026-03-05'),
  is_reprocessed: false,
  is_splitted: false,
  should_add_fixed_expenses: true,
  aux_id: null,
});

const makeRequest = (overrides = {}) => ({
  id: 'user-uuid',
  page: 1,
  pageSize: 10,
  orderBy: 'year',
  order: 'DESC',
  year: 2026,
  month: 3,
  ...overrides,
});

describe('GetAllProcessedIncomesUseCase', () => {
  let useCase: GetAllUseCase;
  let repo: jest.Mocked<any>;

  beforeEach(() => {
    repo = makeRepo();
    useCase = new GetAllUseCase(repo as any);
  });

  describe('errors', () => {
    it('deve retornar falha quando page é negativa', async () => {
      repo.getAllByYearMonth.mockResolvedValue([makePI()]);
      const result = await useCase.execute(makeRequest({ page: -1 }));
      expect(result.isLeft()).toBe(true);
    });
  });

  describe('success', () => {
    it('deve retornar lista paginada de processed incomes', async () => {
      repo.getAllByYearMonth.mockResolvedValue([makePI()]);
      const result = await useCase.execute(makeRequest());
      expect(result.isRight()).toBe(true);
      const pagination = (result.value as any).getValue();
      expect(pagination.data).toHaveLength(1);
      expect(pagination.totalItems).toBe(1);
    });

    it('deve retornar lista vazia quando não há processamentos no mês', async () => {
      repo.getAllByYearMonth.mockResolvedValue([]);
      const result = await useCase.execute(makeRequest());
      expect(result.isRight()).toBe(true);
      const pagination = (result.value as any).getValue();
      expect(pagination.data).toHaveLength(0);
    });

    it('deve calcular totalPages corretamente', async () => {
      const items = [makePI(), makePI(), makePI()];
      repo.getAllByYearMonth
        .mockResolvedValueOnce(items.slice(0, 2))
        .mockResolvedValueOnce(items);
      const result = await useCase.execute(makeRequest({ pageSize: 2 }));
      expect(result.isRight()).toBe(true);
      const pagination = (result.value as any).getValue();
      expect(pagination.totalPages).toBe(2);
    });
  });
});
