import { GetProcessedMonthUseCase } from '../GetProcessedMonthUseCase';
import { Interface as IProcessedIncomesRepo } from '../../../repos/Interface';

const makeRepo = (): jest.Mocked<Pick<IProcessedIncomesRepo, 'getProcessedMonth'>> => ({
  getProcessedMonth: jest.fn(),
});

describe('GetProcessedMonthUseCase', () => {
  let useCase: GetProcessedMonthUseCase;
  let repo: jest.Mocked<any>;

  beforeEach(() => {
    repo = makeRepo();
    useCase = new GetProcessedMonthUseCase(repo as any);
  });

  describe('success', () => {
    it('deve retornar meses processados do usuário', async () => {
      const mockData = { 2026: [3, 2, 1] };
      repo.getProcessedMonth.mockResolvedValue(mockData);
      const result = await useCase.execute({ userId: 'user-uuid' });
      expect(result.isRight()).toBe(true);
      expect((result.value as any).getValue()).toEqual(mockData);
    });

    it('deve chamar repo.getProcessedMonth com userId correto', async () => {
      repo.getProcessedMonth.mockResolvedValue({});
      await useCase.execute({ userId: 'user-uuid' });
      expect(repo.getProcessedMonth).toHaveBeenCalledWith('user-uuid');
    });

    it('deve retornar objeto vazio quando não há processamentos', async () => {
      repo.getProcessedMonth.mockResolvedValue({});
      const result = await useCase.execute({ userId: 'user-uuid' });
      expect(result.isRight()).toBe(true);
      expect((result.value as any).getValue()).toEqual({});
    });
  });
});
