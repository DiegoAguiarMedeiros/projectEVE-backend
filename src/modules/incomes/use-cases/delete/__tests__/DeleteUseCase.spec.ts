import { DeleteUseCase } from '../DeleteUseCase';
import { DeleteErrors } from '../DeleteErrors';
import { AppError } from '../../../../../shared/core/AppError';
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

const makeDomainEvents = () => ({
  dispatchEventsForAggregate: jest.fn(),
});

const makeIncome = () => IncomesMap.toDomain({
  id: 'income-uuid',
  user_id: 'user-uuid',
  description: 'Salário mensal',
  amount: 5000,
  payment_day: 5,
});

describe('DeleteUseCase', () => {
  let useCase: DeleteUseCase;
  let repo: jest.Mocked<IIncomesRepo>;
  let domainEvents: ReturnType<typeof makeDomainEvents>;

  beforeEach(() => {
    repo = makeRepo();
    domainEvents = makeDomainEvents();
    useCase = new DeleteUseCase(repo, domainEvents as any);
  });

  describe('errors', () => {
    it('deve retornar NotFound quando income não existe', async () => {
      repo.getById.mockResolvedValue(null);
      const result = await useCase.execute({ id: 'income-uuid', userId: 'user-uuid' });
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(DeleteErrors.NotFound);
    });

    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      repo.getById.mockRejectedValue(new Error('DB offline'));
      const result = await useCase.execute({ id: 'income-uuid', userId: 'user-uuid' });
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve deletar income com sucesso', async () => {
      repo.getById.mockResolvedValue(makeIncome());
      repo.delete.mockResolvedValue(true);
      const result = await useCase.execute({ id: 'income-uuid', userId: 'user-uuid' });
      expect(result.isRight()).toBe(true);
      expect(repo.delete).toHaveBeenCalledWith('income-uuid');
    });

    it('deve disparar eventos de domínio após deletar', async () => {
      repo.getById.mockResolvedValue(makeIncome());
      repo.delete.mockResolvedValue(true);
      await useCase.execute({ id: 'income-uuid', userId: 'user-uuid' });
      expect(domainEvents.dispatchEventsForAggregate).toHaveBeenCalledTimes(1);
    });

    it('não deve chamar repo.delete quando income não é encontrado', async () => {
      repo.getById.mockResolvedValue(null);
      await useCase.execute({ id: 'income-uuid', userId: 'user-uuid' });
      expect(repo.delete).not.toHaveBeenCalled();
    });
  });
});
