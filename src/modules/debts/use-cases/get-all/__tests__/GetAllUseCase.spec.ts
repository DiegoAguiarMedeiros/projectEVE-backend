import { GetAllUseCase } from '../GetAllUseCase';
import { Interface as IDebtRepo } from '../../../repos/Interface';
import { DebtMap } from '../../../mappers';

const makeDebtRepo = (): jest.Mocked<IDebtRepo> => ({
  getAll: jest.fn(),
  create: jest.fn(),
  getById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  getOnlyById: jest.fn(),
  getTotal: jest.fn(),
  deleteAll: jest.fn(),
  updateInstallmentsPaid: jest.fn(),
});

const makeDebt = () => DebtMap.toDomain({
  id: 'debt-uuid',
  description: 'Financiamento carro',
  amount: 800,
  installments_total: 48,
  installments_paid: 6,
  payment_day: 10,
  status: 'debt.status.pending',
  envelope_id: 'env-uuid',
});

const makeRequest = (overrides = {}) => ({
  id: 'user-uuid',
  page: 1,
  pageSize: 10,
  orderBy: 'description',
  order: 'ASC',
  ...overrides,
});

describe('GetAllDebtsUseCase', () => {
  let useCase: GetAllUseCase;
  let repo: jest.Mocked<IDebtRepo>;

  beforeEach(() => {
    repo = makeDebtRepo();
    useCase = new GetAllUseCase(repo);
  });

  describe('errors', () => {
    it('deve retornar falha quando currentPage é negativo', async () => {
      repo.getAll.mockResolvedValue([makeDebt()]);
      const result = await useCase.execute(makeRequest({ page: -1 }));
      expect(result.isLeft()).toBe(true);
    });
  });

  describe('success', () => {
    it('deve retornar lista paginada de debts', async () => {
      repo.getAll.mockResolvedValue([makeDebt()]);
      const result = await useCase.execute(makeRequest());
      expect(result.isRight()).toBe(true);
    });

    it('deve calcular totalPages corretamente', async () => {
      const debts = [makeDebt(), makeDebt()];
      repo.getAll
        .mockResolvedValueOnce(debts.slice(0, 1))
        .mockResolvedValueOnce(debts);
      const result = await useCase.execute(makeRequest({ pageSize: 1 }));
      expect(result.isRight()).toBe(true);
      const pagination = (result.value as any).getValue();
      expect(pagination.totalPages).toBe(2);
    });

    it('deve retornar lista vazia quando não há debts', async () => {
      repo.getAll.mockResolvedValue([]);
      const result = await useCase.execute(makeRequest());
      expect(result.isRight()).toBe(true);
      const pagination = (result.value as any).getValue();
      expect(pagination.data).toHaveLength(0);
    });
  });
});
