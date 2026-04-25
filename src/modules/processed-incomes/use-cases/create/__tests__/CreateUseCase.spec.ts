import { CreateUseCase } from '../CreateUseCase';
import { AppError } from '../../../../../shared/core/AppError';
import { Interface as IProcessedIncomesRepo } from '../../../repos/Interface';

const makeRepo = (): jest.Mocked<Pick<IProcessedIncomesRepo, 'getAllByYearMonth' | 'create'>> => ({
  getAllByYearMonth: jest.fn(),
  create: jest.fn(),
});

const makeRequest = (overrides = {}) => ({
  userId: 'user-uuid',
  description: 'Processamento março',
  day: 5,
  month: 3,
  year: 2026,
  totalIncomeProcessed: 5000,
  isSplitted: false,
  ...overrides,
});

const makeEnvelopesRepo = () => ({
  getAll: jest.fn().mockResolvedValue([{ percentage: { value: 100 } }]),
});

describe('CreateProcessedIncomeUseCase', () => {
  let useCase: CreateUseCase;
  let repo: jest.Mocked<any>;
  let envelopesRepo: ReturnType<typeof makeEnvelopesRepo>;

  beforeEach(() => {
    repo = makeRepo();
    envelopesRepo = makeEnvelopesRepo();
    useCase = new CreateUseCase(repo as any, envelopesRepo as any);
  });

  describe('errors', () => {
    it('deve retornar falha quando year é inválido', async () => {
      repo.getAllByYearMonth.mockResolvedValue([]);
      const result = await useCase.execute(makeRequest({ year: 0 }));
      expect(result.isLeft()).toBe(true);
      expect(repo.create).not.toHaveBeenCalled();
    });

    it('deve retornar falha quando month é inválido (> 12)', async () => {
      repo.getAllByYearMonth.mockResolvedValue([]);
      const result = await useCase.execute(makeRequest({ month: 13 }));
      expect(result.isLeft()).toBe(true);
      expect(repo.create).not.toHaveBeenCalled();
    });

    it('deve retornar falha quando day é inválido (> 31)', async () => {
      repo.getAllByYearMonth.mockResolvedValue([]);
      const result = await useCase.execute(makeRequest({ day: 32 }));
      expect(result.isLeft()).toBe(true);
      expect(repo.create).not.toHaveBeenCalled();
    });

    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      repo.getAllByYearMonth.mockRejectedValue(new Error('DB offline'));
      const result = await useCase.execute(makeRequest());
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve criar processed income com sucesso', async () => {
      repo.getAllByYearMonth.mockResolvedValue([]);
      repo.create.mockResolvedValue(undefined);
      const result = await useCase.execute(makeRequest());
      expect(result.isRight()).toBe(true);
      expect(repo.create).toHaveBeenCalledTimes(1);
    });

    it('deve definir shouldAddFixedExpenses=true quando não há processamentos no mês', async () => {
      repo.getAllByYearMonth.mockResolvedValue([]);
      repo.create.mockResolvedValue(undefined);
      await useCase.execute(makeRequest());
      const [pi] = repo.create.mock.calls[0];
      expect(pi.shouldAddFixedExpenses).toBe(true);
    });

    it('deve definir shouldAddFixedExpenses=false quando já há processamento no mês', async () => {
      const existingWithFixed = { shouldAddFixedExpenses: true };
      repo.getAllByYearMonth.mockResolvedValue([existingWithFixed]);
      repo.create.mockResolvedValue(undefined);
      await useCase.execute(makeRequest());
      const [pi] = repo.create.mock.calls[0];
      expect(pi.shouldAddFixedExpenses).toBe(false);
    });
  });
});
