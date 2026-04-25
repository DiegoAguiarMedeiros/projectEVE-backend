import { DeleteUseCase } from '../DeleteUseCase';
import { DeleteErrors } from '../DeleteErrors';
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

describe('DeleteDebtUseCase', () => {
  let useCase: DeleteUseCase;
  let repo: jest.Mocked<IDebtRepo>;
  let domainEvents: ReturnType<typeof makeDomainEvents>;

  beforeEach(() => {
    repo = makeDebtRepo();
    domainEvents = makeDomainEvents();
    useCase = new DeleteUseCase(repo, domainEvents as any);
  });

  describe('errors', () => {
    it('deve retornar NotFound quando debt não existe', async () => {
      repo.getById.mockResolvedValue(null);
      const result = await useCase.execute({ id: 'debt-uuid', userId: 'user-uuid' });
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(DeleteErrors.NotFound);
    });

    it('não deve chamar repo.delete quando debt não é encontrado', async () => {
      repo.getById.mockResolvedValue(null);
      await useCase.execute({ id: 'debt-uuid', userId: 'user-uuid' });
      expect(repo.delete).not.toHaveBeenCalled();
    });

    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      repo.getById.mockRejectedValue(new Error('DB offline'));
      const result = await useCase.execute({ id: 'debt-uuid', userId: 'user-uuid' });
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve deletar debt com sucesso', async () => {
      repo.getById.mockResolvedValue(makeDebt());
      repo.delete.mockResolvedValue(true);
      const result = await useCase.execute({ id: 'debt-uuid', userId: 'user-uuid' });
      expect(result.isRight()).toBe(true);
      expect(repo.delete).toHaveBeenCalledWith('debt-uuid');
    });

    it('deve despachar eventos de domínio após deleção bem-sucedida', async () => {
      repo.getById.mockResolvedValue(makeDebt());
      repo.delete.mockResolvedValue(true);
      await useCase.execute({ id: 'debt-uuid', userId: 'user-uuid' });
      expect(domainEvents.dispatchEventsForAggregate).toHaveBeenCalledTimes(1);
    });
  });
});
