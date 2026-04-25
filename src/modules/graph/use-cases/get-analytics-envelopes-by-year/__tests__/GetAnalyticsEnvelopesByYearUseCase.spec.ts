import { GetAnalyticsEnvelopesByYearUseCase } from '../GetAnalyticsEnvelopesByYearUseCase';
import { Interface as ITransactionsRepo } from '../../../../transactions/repos/Interface';

const makeTransactionsRepo = (): jest.Mocked<Pick<ITransactionsRepo, 'getIncomesByYear' | 'getGoalsByYear' | 'getExpensesByYear'>> => ({
  getIncomesByYear: jest.fn(),
  getGoalsByYear: jest.fn(),
  getExpensesByYear: jest.fn(),
});

const mockYearData = Array(12).fill(0);
const mockIncomes = [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000];
const mockGoals = [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200];
const mockExpenses = [600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600];

describe('GetAnalyticsEnvelopesByYearUseCase', () => {
  let useCase: GetAnalyticsEnvelopesByYearUseCase;
  let transactionsRepo: jest.Mocked<any>;

  beforeEach(() => {
    transactionsRepo = makeTransactionsRepo();
    useCase = new GetAnalyticsEnvelopesByYearUseCase(transactionsRepo as any);
  });

  describe('success', () => {
    it('deve retornar chartData com 4 séries', async () => {
      transactionsRepo.getIncomesByYear.mockResolvedValue(mockIncomes);
      transactionsRepo.getGoalsByYear.mockResolvedValue(mockGoals);
      transactionsRepo.getExpensesByYear.mockResolvedValue(mockExpenses);

      const result = await useCase.execute({ id: 'user-uuid', year: 2026 });
      expect(result.isRight()).toBe(true);
      const data = (result.value as any).getValue();
      expect(data.series).toHaveLength(4);
    });

    it('deve incluir série de balance calculada corretamente', async () => {
      transactionsRepo.getIncomesByYear.mockResolvedValue(mockIncomes);
      transactionsRepo.getGoalsByYear.mockResolvedValue(mockGoals);
      transactionsRepo.getExpensesByYear.mockResolvedValue(mockExpenses);

      const result = await useCase.execute({ id: 'user-uuid', year: 2026 });
      const data = (result.value as any).getValue();
      const balanceSeries = data.series.find((s: any) => s.name === 'balance');
      expect(balanceSeries).toBeDefined();
      expect(balanceSeries.data[0]).toBe(1000 - 600 - 200);
    });

    it('deve incluir 12 categorias de meses', async () => {
      transactionsRepo.getIncomesByYear.mockResolvedValue(mockIncomes);
      transactionsRepo.getGoalsByYear.mockResolvedValue(mockGoals);
      transactionsRepo.getExpensesByYear.mockResolvedValue(mockExpenses);

      const result = await useCase.execute({ id: 'user-uuid', year: 2026 });
      const data = (result.value as any).getValue();
      expect(data.categories).toHaveLength(12);
    });

    it('deve chamar os repos com os parâmetros corretos', async () => {
      transactionsRepo.getIncomesByYear.mockResolvedValue(mockYearData);
      transactionsRepo.getGoalsByYear.mockResolvedValue(mockYearData);
      transactionsRepo.getExpensesByYear.mockResolvedValue(mockYearData);

      await useCase.execute({ id: 'user-uuid', year: 2026 });
      expect(transactionsRepo.getIncomesByYear).toHaveBeenCalledWith(2026, 'user-uuid');
      expect(transactionsRepo.getGoalsByYear).toHaveBeenCalledWith(2026, 'user-uuid');
      expect(transactionsRepo.getExpensesByYear).toHaveBeenCalledWith(2026, 'user-uuid');
    });
  });
});
