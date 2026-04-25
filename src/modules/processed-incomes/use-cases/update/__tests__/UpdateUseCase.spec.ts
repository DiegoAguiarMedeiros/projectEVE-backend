import { UpdateUseCase } from '../UpdateUseCase';
import { UpdateErrors } from '../UpdateErrors';
import { AppError } from '../../../../../shared/core/AppError';
import { Interface as IProcessedIncomesRepo } from '../../../repos/Interface';
import { ProcessedIncomesMap } from '../../../mappers';

const makeRepo = (): jest.Mocked<Pick<IProcessedIncomesRepo, 'getById' | 'update'>> => ({
  getById: jest.fn(),
  update: jest.fn(),
});

const makeDomainEvents = () => ({ dispatchEventsForAggregate: jest.fn() });
const makeEnvelopesRepo = () => ({ getAll: jest.fn().mockResolvedValue([]) });

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

const makeRequest = (overrides = {}) => ({
  request: { id: 'pi-uuid', userId: 'user-uuid' },
  fieldUpdate: {
    description: 'Processamento atualizado',
    totalIncomeProcessed: 6000,
    isSplitted: true,
    isReprocessed: true,
  },
  ...overrides,
});

describe('UpdateProcessedIncomeUseCase', () => {
  let useCase: UpdateUseCase;
  let repo: jest.Mocked<any>;
  let envelopesRepo: ReturnType<typeof makeEnvelopesRepo>;
  let domainEvents: ReturnType<typeof makeDomainEvents>;

  beforeEach(() => {
    repo = makeRepo();
    envelopesRepo = makeEnvelopesRepo();
    domainEvents = makeDomainEvents();
    useCase = new UpdateUseCase(repo as any, envelopesRepo as any, domainEvents as any);
  });

  describe('errors', () => {
    it('deve retornar NotFound quando processed income não existe', async () => {
      repo.getById.mockResolvedValue(null);
      const result = await useCase.execute(makeRequest());
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(UpdateErrors.NotFound);
    });

    it('deve retornar UpdateError quando repo.update retorna false', async () => {
      repo.getById.mockResolvedValue(makePI());
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
  });

  describe('success', () => {
    it('deve atualizar processed income com sucesso', async () => {
      repo.getById.mockResolvedValue(makePI());
      repo.update.mockResolvedValue(true);
      const result = await useCase.execute(makeRequest());
      expect(result.isRight()).toBe(true);
      expect(repo.update).toHaveBeenCalledTimes(1);
    });

    it('deve despachar eventos de domínio após atualização', async () => {
      repo.getById.mockResolvedValue(makePI());
      repo.update.mockResolvedValue(true);
      await useCase.execute(makeRequest());
      expect(domainEvents.dispatchEventsForAggregate).toHaveBeenCalledTimes(1);
    });

    it('deve manter valores originais para campos falsy', async () => {
      repo.getById.mockResolvedValue(makePI());
      repo.update.mockResolvedValue(true);
      await useCase.execute(makeRequest({
        fieldUpdate: { description: '', totalIncomeProcessed: 0, isSplitted: false, isReprocessed: false },
      }));
      const [, updatedPI] = repo.update.mock.calls[0];
      expect(updatedPI.description.value).toBe('Processamento março');
      expect(updatedPI.totalIncomeProcessed.value).toBe(5000);
    });
  });
});
