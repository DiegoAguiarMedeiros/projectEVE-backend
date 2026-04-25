import { GetAllUseCase } from '../GetAllUseCase';
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

const makeRequest = (overrides = {}) => ({
  id: 'user-uuid',
  page: 1,
  pageSize: 10,
  orderBy: 'name',
  order: 'ASC',
  ...overrides,
});

describe('GetAllCreditCardsUseCase', () => {
  let useCase: GetAllUseCase;
  let repo: jest.Mocked<ICreditCardRepo>;

  beforeEach(() => {
    repo = makeRepo();
    useCase = new GetAllUseCase(repo);
  });

  describe('success', () => {
    it('deve retornar página com cartões', async () => {
      const cc = makeCC();
      repo.getAll
        .mockResolvedValueOnce([cc])
        .mockResolvedValueOnce([cc]);
      const result = await useCase.execute(makeRequest());
      expect(result.isRight()).toBe(true);
      const pagination = (result.value as any).getValue();
      expect(pagination.data).toHaveLength(1);
      expect(pagination.totalItems).toBe(1);
    });

    it('deve retornar página vazia quando não há cartões', async () => {
      repo.getAll.mockResolvedValue([]);
      const result = await useCase.execute(makeRequest());
      expect(result.isRight()).toBe(true);
      const pagination = (result.value as any).getValue();
      expect(pagination.data).toHaveLength(0);
    });
  });

  describe('errors', () => {
    it('deve retornar falha quando currentPage é negativo', async () => {
      repo.getAll.mockResolvedValue([]);
      const result = await useCase.execute(makeRequest({ page: -1 }));
      expect(result.isLeft()).toBe(true);
    });
  });
});
