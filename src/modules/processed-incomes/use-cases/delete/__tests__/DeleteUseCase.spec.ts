import { DeleteUseCase } from '../DeleteUseCase';
import { DeleteErrors } from '../DeleteErrors';
import { AppError } from '../../../../../shared/core/AppError';
import { Interface as IProcessedIncomesRepo } from '../../../repos/Interface';
import { ProcessedIncomesMap } from '../../../mappers';

const makeRepo = (): jest.Mocked<Pick<IProcessedIncomesRepo, 'getById' | 'delete'>> => ({
  getById: jest.fn(),
  delete: jest.fn(),
});

const makeDomainEvents = () => ({ dispatchEventsForAggregate: jest.fn() });

const makePI = () => ProcessedIncomesMap.toDomain({
  id: 'pi-uuid',
  user_id: 'user-uuid',
  description: 'Processamento março',
  day: 5,
  month: 3,
  year: 2026,
  total_income_processed: 5000,
  processed_at: new Date('2026-03-05'),
  is_reprocessed: false,
  is_splitted: false,
  should_add_fixed_expenses: true,
  aux_id: null,
});

describe('DeleteProcessedIncomeUseCase', () => {
  let useCase: DeleteUseCase;
  let repo: jest.Mocked<any>;
  let domainEvents: ReturnType<typeof makeDomainEvents>;

  beforeEach(() => {
    repo = makeRepo();
    domainEvents = makeDomainEvents();
    useCase = new DeleteUseCase(repo as any, domainEvents as any);
  });

  describe('errors', () => {
    it('deve retornar NotFound quando processed income não existe', async () => {
      repo.getById.mockResolvedValue(null);
      const result = await useCase.execute({ id: 'pi-uuid', userId: 'user-uuid' });
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(DeleteErrors.NotFound);
    });

    it('não deve chamar repo.delete quando não encontrado', async () => {
      repo.getById.mockResolvedValue(null);
      await useCase.execute({ id: 'pi-uuid', userId: 'user-uuid' });
      expect(repo.delete).not.toHaveBeenCalled();
    });

    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      repo.getById.mockRejectedValue(new Error('DB offline'));
      const result = await useCase.execute({ id: 'pi-uuid', userId: 'user-uuid' });
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve deletar processed income com sucesso', async () => {
      repo.getById.mockResolvedValue(makePI());
      repo.delete.mockResolvedValue(true);
      const result = await useCase.execute({ id: 'pi-uuid', userId: 'user-uuid' });
      expect(result.isRight()).toBe(true);
      expect(repo.delete).toHaveBeenCalledWith('pi-uuid');
    });

    it('deve despachar eventos de domínio após deleção', async () => {
      repo.getById.mockResolvedValue(makePI());
      repo.delete.mockResolvedValue(true);
      await useCase.execute({ id: 'pi-uuid', userId: 'user-uuid' });
      expect(domainEvents.dispatchEventsForAggregate).toHaveBeenCalledTimes(1);
    });
  });
});
