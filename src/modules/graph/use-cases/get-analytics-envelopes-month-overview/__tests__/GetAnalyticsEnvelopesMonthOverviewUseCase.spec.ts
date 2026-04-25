import { GetAnalyticsEnvelopesMonthOverviewUseCase } from '../GetAnalyticsEnvelopesMonthOverviewUseCase';
import { Interface as ITransactionsRepo } from '../../../../transactions/repos/Interface';

const makeTransactionsRepo = (): jest.Mocked<Pick<ITransactionsRepo, 'getIncomesMonthOverview' | 'getGoalsMonthOverview' | 'getExpensesMonthOverview'>> => ({
  getIncomesMonthOverview: jest.fn(),
  getGoalsMonthOverview: jest.fn(),
  getExpensesMonthOverview: jest.fn(),
});

describe('GetAnalyticsEnvelopesMonthOverviewUseCase', () => {
  let useCase: GetAnalyticsEnvelopesMonthOverviewUseCase;
  let transactionsRepo: jest.Mocked<any>;

  beforeEach(() => {
    transactionsRepo = makeTransactionsRepo();
    useCase = new GetAnalyticsEnvelopesMonthOverviewUseCase(transactionsRepo as any);
  });

  describe('success', () => {
    it('deve retornar array com 4 itens (incomes, goals, expenses, balance)', async () => {
      transactionsRepo.getIncomesMonthOverview.mockResolvedValue(1000);
      transactionsRepo.getGoalsMonthOverview.mockResolvedValue(200);
      transactionsRepo.getExpensesMonthOverview.mockResolvedValue(600);

      const result = await useCase.execute({ id: 'user-uuid', year: 2026, month: 3 });
      expect(result.isRight()).toBe(true);
      const data = (result.value as any).getValue();
      expect(data).toHaveLength(4);
    });

    it('deve calcular balance como incomes - expenses - goals', async () => {
      transactionsRepo.getIncomesMonthOverview.mockResolvedValue(1000);
      transactionsRepo.getGoalsMonthOverview.mockResolvedValue(200);
      transactionsRepo.getExpensesMonthOverview.mockResolvedValue(600);

      const result = await useCase.execute({ id: 'user-uuid', year: 2026, month: 3 });
      const data = (result.value as any).getValue();
      const balanceItem = data.find((item: any) => item.title === 'balance');
      expect(balanceItem.total).toBe(200);
    });

    it('deve chamar repos com os parâmetros corretos', async () => {
      transactionsRepo.getIncomesMonthOverview.mockResolvedValue(0);
      transactionsRepo.getGoalsMonthOverview.mockResolvedValue(0);
      transactionsRepo.getExpensesMonthOverview.mockResolvedValue(0);

      await useCase.execute({ id: 'user-uuid', year: 2026, month: 3 });
      expect(transactionsRepo.getIncomesMonthOverview).toHaveBeenCalledWith(2026, 3, 'user-uuid');
      expect(transactionsRepo.getGoalsMonthOverview).toHaveBeenCalledWith(2026, 3, 'user-uuid');
      expect(transactionsRepo.getExpensesMonthOverview).toHaveBeenCalledWith(2026, 3, 'user-uuid');
    });

    it('deve retornar totais corretos para cada categoria', async () => {
      transactionsRepo.getIncomesMonthOverview.mockResolvedValue(1000);
      transactionsRepo.getGoalsMonthOverview.mockResolvedValue(200);
      transactionsRepo.getExpensesMonthOverview.mockResolvedValue(600);

      const result = await useCase.execute({ id: 'user-uuid', year: 2026, month: 3 });
      const data = (result.value as any).getValue();
      expect(data.find((i: any) => i.title === 'incomes').total).toBe(1000);
      expect(data.find((i: any) => i.title === 'goals').total).toBe(200);
      expect(data.find((i: any) => i.title === 'expenses').total).toBe(600);
    });
  });
});
