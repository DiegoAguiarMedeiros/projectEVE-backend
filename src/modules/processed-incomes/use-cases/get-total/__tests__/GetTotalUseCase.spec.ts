import { GetTotalUseCase } from '../GetTotalUseCase';
import { Interface as IProcessedIncomesRepo } from '../../../repos/Interface';

const makeRepo = (): jest.Mocked<Pick<IProcessedIncomesRepo, 'getTotalbyMonth'>> => ({
  getTotalbyMonth: jest.fn(),
});

describe('GetTotalProcessedIncomeUseCase', () => {
  let useCase: GetTotalUseCase;
  let repo: jest.Mocked<any>;

  beforeEach(() => {
    repo = makeRepo();
    useCase = new GetTotalUseCase(repo as any);
  });

  describe('success', () => {
    it('deve retornar total de incomes processados no mês', async () => {
      repo.getTotalbyMonth.mockResolvedValue({ total: 5000 });
      const result = await useCase.execute({ userId: 'user-uuid', year: 2026, month: 3 });
      expect(result.isRight()).toBe(true);
      expect((result.value as any).getValue()).toEqual({ total: 5000 });
    });

    it('deve chamar repo.getTotalbyMonth com parâmetros corretos', async () => {
      repo.getTotalbyMonth.mockResolvedValue({ total: 0 });
      await useCase.execute({ userId: 'user-uuid', year: 2026, month: 3 });
      expect(repo.getTotalbyMonth).toHaveBeenCalledWith(2026, 3, 'user-uuid');
    });

    it('deve retornar zero quando não há processamentos no mês', async () => {
      repo.getTotalbyMonth.mockResolvedValue({ total: 0 });
      const result = await useCase.execute({ userId: 'user-uuid', year: 2026, month: 3 });
      expect(result.isRight()).toBe(true);
      expect((result.value as any).getValue().total).toBe(0);
    });
  });
});
