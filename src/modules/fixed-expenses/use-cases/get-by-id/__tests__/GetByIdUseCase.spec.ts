import { GetByIdUseCase } from '../GetByIdUseCase';
import { GetByIdErrors } from '../GetByIdErrors';
import { Interface as IFixedExpenseRepo } from '../../../repos/Interface';
import { FixedExpenseMap } from '../../../mappers';

const makeRepo = (): jest.Mocked<IFixedExpenseRepo> => ({
  getAll: jest.fn(),
  create: jest.fn(),
  getById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  deleteAll: jest.fn(),
  getTotalByEnvelope: jest.fn(),
});

const makeFE = () => FixedExpenseMap.toDomain({
  id: 'fe-uuid',
  envelope_id: 'env-uuid',
  description: 'Conta de internet',
  amount: 120,
  payment_day: 10,
});

describe('GetByIdFixedExpenseUseCase', () => {
  let useCase: GetByIdUseCase;
  let repo: jest.Mocked<IFixedExpenseRepo>;

  beforeEach(() => {
    repo = makeRepo();
    useCase = new GetByIdUseCase(repo);
  });

  describe('errors', () => {
    it('deve retornar NotFound quando fixed expense não existe', async () => {
      repo.getById.mockResolvedValue(null);
      const result = await useCase.execute({ id: 'fe-uuid', userId: 'user-uuid' });
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(GetByIdErrors.NotFound);
    });
  });

  describe('success', () => {
    it('deve retornar fixed expense quando encontrado', async () => {
      repo.getById.mockResolvedValue(makeFE());
      const result = await useCase.execute({ id: 'fe-uuid', userId: 'user-uuid' });
      expect(result.isRight()).toBe(true);
      const fe = (result.value as any).getValue();
      expect(fe.id.toString()).toBe('fe-uuid');
    });

    it('deve chamar repo.getById com id e userId corretos', async () => {
      repo.getById.mockResolvedValue(makeFE());
      await useCase.execute({ id: 'fe-uuid', userId: 'user-uuid' });
      expect(repo.getById).toHaveBeenCalledWith('fe-uuid', 'user-uuid');
    });
  });
});
