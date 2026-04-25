import { GetGoalsCumulativeAmountUseCase } from '../GetGoalsCumulativeAmountUseCase';
import { Interface as ITransactionsRepo } from '../../../../transactions/repos/Interface';

const makeTransactionsRepo = (): jest.Mocked<Pick<ITransactionsRepo, 'getGoalsCumulativeAmount'>> => ({
  getGoalsCumulativeAmount: jest.fn(),
});

describe('GetGoalsCumulativeAmountUseCase', () => {
  let useCase: GetGoalsCumulativeAmountUseCase;
  let transactionsRepo: jest.Mocked<any>;

  beforeEach(() => {
    transactionsRepo = makeTransactionsRepo();
    useCase = new GetGoalsCumulativeAmountUseCase(transactionsRepo as any);
  });

  describe('success', () => {
    it('deve retornar o total acumulado de goals', async () => {
      transactionsRepo.getGoalsCumulativeAmount.mockResolvedValue(5000);
      const result = await useCase.execute({ id: 'user-uuid', year: 2026, month: 3 });
      expect(result.isRight()).toBe(true);
      expect(result.value.getValue()).toBe(5000);
    });

    it('deve chamar repo com os parâmetros corretos', async () => {
      transactionsRepo.getGoalsCumulativeAmount.mockResolvedValue(5000);
      await useCase.execute({ id: 'user-uuid', year: 2026, month: 3 });
      expect(transactionsRepo.getGoalsCumulativeAmount).toHaveBeenCalledWith(2026, 3, 'user-uuid');
    });

    it('deve retornar zero quando não há transações de goals', async () => {
      transactionsRepo.getGoalsCumulativeAmount.mockResolvedValue(0);
      const result = await useCase.execute({ id: 'user-uuid', year: 2026, month: 1 });
      expect(result.isRight()).toBe(true);
      expect(result.value.getValue()).toBe(0);
    });
  });
});
