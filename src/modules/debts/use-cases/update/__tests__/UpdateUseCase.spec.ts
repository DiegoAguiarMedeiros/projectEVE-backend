import { UpdateUseCase } from '../UpdateUseCase';
import { UpdateErrors } from '../UpdateErrors';
import { AppError } from '../../../../../shared/core/AppError';
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

const makeDomainEvents = () => ({
  dispatchEventsForAggregate: jest.fn(),
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
  request: { id: 'debt-uuid', userId: 'user-uuid' },
  fieldUpdate: {
    description: 'Financiamento moto',
    amount: 500,
    installmentsTotal: 24,
    installmentsPaid: 3,
    paymentDay: 15,
    status: 'debt.status.pending' as const,
  },
  ...overrides,
});

describe('UpdateDebtUseCase', () => {
  let useCase: UpdateUseCase;
  let repo: jest.Mocked<IDebtRepo>;
  let domainEvents: ReturnType<typeof makeDomainEvents>;

  beforeEach(() => {
    repo = makeDebtRepo();
    domainEvents = makeDomainEvents();
    useCase = new UpdateUseCase(repo, domainEvents as any);
  });

  describe('errors', () => {
    it('deve retornar NotFound quando debt não existe', async () => {
      repo.getById.mockResolvedValue(null);
      const result = await useCase.execute(makeRequest());
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(UpdateErrors.NotFound);
    });

    it('deve retornar UpdateError quando repo.update retorna false', async () => {
      repo.getById.mockResolvedValue(makeDebt());
      repo.update.mockResolvedValue(false);
      const result = await useCase.execute(makeRequest());
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(UpdateErrors.UpdateError);
    });

    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      repo.getById.mockRejectedValue(new Error('DB offline'));
      const result = await useCase.execute(makeRequest());
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });

    it('deve retornar falha quando paymentDay é inválido (> 31)', async () => {
      repo.getById.mockResolvedValue(makeDebt());
      const result = await useCase.execute(makeRequest({
        fieldUpdate: { description: 'Teste', amount: 100, installmentsTotal: 12, installmentsPaid: 1, paymentDay: 32, status: 'debt.status.pending' },
      }));
      expect(result.isLeft()).toBe(true);
      expect(repo.update).not.toHaveBeenCalled();
    });
  });

  describe('success', () => {
    it('deve atualizar debt com sucesso', async () => {
      repo.getById.mockResolvedValue(makeDebt());
      repo.update.mockResolvedValue(true);
      const result = await useCase.execute(makeRequest());
      expect(result.isRight()).toBe(true);
      expect(repo.update).toHaveBeenCalledTimes(1);
    });

    it('deve chamar repo.update com os valores atualizados', async () => {
      repo.getById.mockResolvedValue(makeDebt());
      repo.update.mockResolvedValue(true);
      await useCase.execute(makeRequest());
      const [id, updatedDebt] = repo.update.mock.calls[0];
      expect(id).toBe('debt-uuid');
      expect(updatedDebt.description.value).toBe('Financiamento moto');
      expect(updatedDebt.amount.value).toBe(500);
      expect(updatedDebt.paymentDay.value).toBe(15);
    });

    it('deve despachar eventos de domínio após atualização bem-sucedida', async () => {
      repo.getById.mockResolvedValue(makeDebt());
      repo.update.mockResolvedValue(true);
      await useCase.execute(makeRequest());
      expect(domainEvents.dispatchEventsForAggregate).toHaveBeenCalledTimes(1);
    });

    it('deve manter valores originais para campos não fornecidos (falsy)', async () => {
      repo.getById.mockResolvedValue(makeDebt());
      repo.update.mockResolvedValue(true);
      await useCase.execute(makeRequest({
        fieldUpdate: { description: 'Novo nome', amount: 0, installmentsTotal: 0, installmentsPaid: 0, paymentDay: 0, status: undefined },
      }));
      const [, updatedDebt] = repo.update.mock.calls[0];
      expect(updatedDebt.amount.value).toBe(800);
      expect(updatedDebt.installmentsTotal.value).toBe(48);
      expect(updatedDebt.paymentDay.value).toBe(10);
    });
  });
});
