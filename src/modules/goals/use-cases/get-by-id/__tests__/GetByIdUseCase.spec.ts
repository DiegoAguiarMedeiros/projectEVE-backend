import { GetByIdUseCase } from '../GetByIdUseCase';
import { GetByIdErrors } from '../GetByIdErrors';
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

describe('GetByIdGoalsUseCase', () => {
  let useCase: GetByIdUseCase;
  let repo: jest.Mocked<IGoalsRepo>;

  beforeEach(() => {
    repo = makeGoalsRepo();
    useCase = new GetByIdUseCase(repo);
  });

  describe('errors', () => {
    it('deve retornar NotFound quando goal não existe', async () => {
      repo.getById.mockResolvedValue(null);
      const result = await useCase.execute({ id: 'goal-uuid', userId: 'user-uuid' });
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(GetByIdErrors.NotFound);
    });
  });

  describe('success', () => {
    it('deve retornar goal quando encontrado', async () => {
      repo.getById.mockResolvedValue(makeGoal());
      const result = await useCase.execute({ id: 'goal-uuid', userId: 'user-uuid' });
      expect(result.isRight()).toBe(true);
      const goal = (result.value as any).getValue();
      expect(goal.id.toString()).toBe('goal-uuid');
    });

    it('deve chamar repo.getById com id e userId corretos', async () => {
      repo.getById.mockResolvedValue(makeGoal());
      await useCase.execute({ id: 'goal-uuid', userId: 'user-uuid' });
      expect(repo.getById).toHaveBeenCalledWith('goal-uuid', 'user-uuid');
    });
  });
});
