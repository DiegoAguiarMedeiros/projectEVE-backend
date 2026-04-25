import { GetTotalUseCase } from '../GetTotalUseCase';
import { Interface as IIncomesRepo } from '../../../repos/Interface';

const makeRepo = (): jest.Mocked<IIncomesRepo> => ({
  getAll: jest.fn(),
  create: jest.fn(),
  getById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  getTotal: jest.fn(),
  deleteAll: jest.fn(),
});

describe('GetTotalUseCase', () => {
  let useCase: GetTotalUseCase;
  let repo: jest.Mocked<IIncomesRepo>;

  beforeEach(() => {
    repo = makeRepo();
    useCase = new GetTotalUseCase(repo);
  });

  describe('success', () => {
    it('deve retornar o total de incomes do usuário', async () => {
      repo.getTotal.mockResolvedValue(15000);
      const result = await useCase.execute({ userId: 'user-uuid' });
      expect(result.isRight()).toBe(true);
      const value = (result.value as any).getValue();
      expect(value.total).toBe(15000);
    });

    it('deve retornar zero quando usuário não tem incomes', async () => {
      repo.getTotal.mockResolvedValue(0);
      const result = await useCase.execute({ userId: 'user-uuid' });
      expect(result.isRight()).toBe(true);
      const value = (result.value as any).getValue();
      expect(value.total).toBe(0);
    });

    it('deve chamar repo.getTotal com userId correto', async () => {
      repo.getTotal.mockResolvedValue(5000);
      await useCase.execute({ userId: 'user-uuid' });
      expect(repo.getTotal).toHaveBeenCalledWith('user-uuid');
    });
  });
});
