import { GetByIdUseCase } from '../GetByIdUseCase';
import { GetByIdErrors } from '../GetByIdErrors';
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

describe('GetByIdDebtUseCase', () => {
  let useCase: GetByIdUseCase;
  let repo: jest.Mocked<IDebtRepo>;

  beforeEach(() => {
    repo = makeDebtRepo();
    useCase = new GetByIdUseCase(repo);
  });

  describe('errors', () => {
    it('deve retornar NotFound quando debt não existe', async () => {
      repo.getById.mockResolvedValue(null);
      const result = await useCase.execute({ id: 'debt-uuid', userId: 'user-uuid' });
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(GetByIdErrors.NotFound);
    });
  });

  describe('success', () => {
    it('deve retornar debt quando encontrado', async () => {
      repo.getById.mockResolvedValue(makeDebt());
      const result = await useCase.execute({ id: 'debt-uuid', userId: 'user-uuid' });
      expect(result.isRight()).toBe(true);
    });

    it('deve chamar repo.getById com os parâmetros corretos', async () => {
      repo.getById.mockResolvedValue(makeDebt());
      await useCase.execute({ id: 'debt-uuid', userId: 'user-uuid' });
      expect(repo.getById).toHaveBeenCalledWith('debt-uuid', 'user-uuid');
    });
  });
});
