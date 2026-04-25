import { GetByIdUseCase } from '../GetByIdUseCase';
import { GetByIdErrors } from '../GetByIdErrors';
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

describe('GetByIdUseCase', () => {
  let useCase: GetByIdUseCase;
  let repo: jest.Mocked<IIncomesRepo>;

  beforeEach(() => {
    repo = makeRepo();
    useCase = new GetByIdUseCase(repo);
  });

  describe('errors', () => {
    it('deve retornar NotFound quando income não existe', async () => {
      repo.getById.mockResolvedValue(null);
      const result = await useCase.execute({ id: 'income-uuid', userId: 'user-uuid' });
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(GetByIdErrors.NotFound);
    });
  });

  describe('success', () => {
    it('deve retornar income quando encontrado', async () => {
      const income = makeIncome();
      repo.getById.mockResolvedValue(income);
      const result = await useCase.execute({ id: 'income-uuid', userId: 'user-uuid' });
      expect(result.isRight()).toBe(true);
      const returned = (result.value as any).getValue();
      expect(returned.id.toString()).toBe('income-uuid');
    });

    it('deve chamar repo.getById com id e userId corretos', async () => {
      repo.getById.mockResolvedValue(makeIncome());
      await useCase.execute({ id: 'income-uuid', userId: 'user-uuid' });
      expect(repo.getById).toHaveBeenCalledWith('income-uuid', 'user-uuid');
    });
  });
});
