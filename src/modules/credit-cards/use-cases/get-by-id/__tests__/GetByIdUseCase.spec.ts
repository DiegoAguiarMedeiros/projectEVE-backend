import { GetByIdUseCase } from '../GetByIdUseCase';
import { GetByIdErrors } from '../GetByIdErrors';
import { Interface as ICreditCardRepo } from '../../../repos/Interface';
import { CreditCardMap } from '../../../mappers';

const makeRepo = (): jest.Mocked<ICreditCardRepo> => ({
  getAll: jest.fn(),
  create: jest.fn(),
  getById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  checkName: jest.fn(),
  deleteAll: jest.fn(),
});

const makeCC = () => CreditCardMap.toDomain({
  id: 'cc-uuid',
  name: 'Nubank',
  flag: 'Visa',
  active: true,
  user_id: 'user-uuid',
});

describe('GetByIdCreditCardUseCase', () => {
  let useCase: GetByIdUseCase;
  let repo: jest.Mocked<ICreditCardRepo>;

  beforeEach(() => {
    repo = makeRepo();
    useCase = new GetByIdUseCase(repo);
  });

  describe('errors', () => {
    it('deve retornar NotFound quando cartão não existe', async () => {
      repo.getById.mockResolvedValue(null);
      const result = await useCase.execute({ id: 'cc-uuid', userId: 'user-uuid' });
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(GetByIdErrors.NotFound);
    });
  });

  describe('success', () => {
    it('deve retornar cartão quando encontrado', async () => {
      repo.getById.mockResolvedValue(makeCC());
      const result = await useCase.execute({ id: 'cc-uuid', userId: 'user-uuid' });
      expect(result.isRight()).toBe(true);
      const cc = (result.value as any).getValue();
      expect(cc.id.toString()).toBe('cc-uuid');
    });

    it('deve chamar repo.getById com id e userId corretos', async () => {
      repo.getById.mockResolvedValue(makeCC());
      await useCase.execute({ id: 'cc-uuid', userId: 'user-uuid' });
      expect(repo.getById).toHaveBeenCalledWith('cc-uuid', 'user-uuid');
    });
  });
});
