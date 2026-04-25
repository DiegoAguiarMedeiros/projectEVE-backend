import { DeleteAllUseCase } from '../DeleteAllUseCase';
import { DeleteAllErrors } from '../DeleteAllErrors';
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

const makeIncome = (id = 'income-uuid') => IncomesMap.toDomain({
  id,
  user_id: 'user-uuid',
  description: 'Salário mensal',
  amount: 5000,
  payment_day: 5,
});

describe('DeleteAllUseCase', () => {
  let useCase: DeleteAllUseCase;
  let repo: jest.Mocked<IIncomesRepo>;
  let domainEvents: ReturnType<typeof makeDomainEvents>;

  beforeEach(() => {
    repo = makeRepo();
    domainEvents = makeDomainEvents();
    useCase = new DeleteAllUseCase(repo, domainEvents as any);
  });

  describe('errors', () => {
    it('deve retornar NothingToDelete quando ids é array vazio', async () => {
      const result = await useCase.execute({ ids: [], userId: 'user-uuid' });
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(DeleteAllErrors.NothingToDelete);
    });

    it('deve retornar NothingToDelete quando ids é undefined', async () => {
      const result = await useCase.execute({ ids: undefined as any, userId: 'user-uuid' });
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(DeleteAllErrors.NothingToDelete);
    });

    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      repo.getAll.mockRejectedValue(new Error('DB offline'));
      const result = await useCase.execute({ ids: ['income-uuid'], userId: 'user-uuid' });
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve deletar todos os incomes encontrados', async () => {
      const income = makeIncome('income-uuid');
      repo.getAll.mockResolvedValue([income]);
      repo.deleteAll.mockResolvedValue(1);
      const result = await useCase.execute({ ids: ['income-uuid'], userId: 'user-uuid' });
      expect(result.isRight()).toBe(true);
      expect(repo.deleteAll).toHaveBeenCalledWith(['income-uuid'], 'user-uuid');
    });

    it('deve disparar eventos para cada income deletado', async () => {
      const income1 = makeIncome('id-1');
      const income2 = makeIncome('id-2');
      repo.getAll.mockResolvedValue([income1, income2]);
      repo.deleteAll.mockResolvedValue(2);
      await useCase.execute({ ids: ['id-1', 'id-2'], userId: 'user-uuid' });
      expect(domainEvents.dispatchEventsForAggregate).toHaveBeenCalledTimes(2);
    });

    it('não deve chamar deleteAll quando nenhum income é encontrado nos ids', async () => {
      repo.getAll.mockResolvedValue([makeIncome('outro-id')]);
      repo.deleteAll.mockResolvedValue(0);
      await useCase.execute({ ids: ['income-uuid'], userId: 'user-uuid' });
      expect(repo.deleteAll).toHaveBeenCalledTimes(1);
      expect(domainEvents.dispatchEventsForAggregate).not.toHaveBeenCalled();
    });
  });
});
