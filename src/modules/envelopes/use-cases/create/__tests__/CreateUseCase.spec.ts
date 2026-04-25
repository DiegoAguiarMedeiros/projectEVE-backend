import { CreateUseCase } from '../CreateUseCase';
import { CreateErrors } from '../CreateErrors';
import { AppError } from '../../../../../shared/core/AppError';
import { Interface as IEnvelopeRepo } from '../../../repos/Interface';

const makeRepo = (): jest.Mocked<IEnvelopeRepo> => ({
  getAll: jest.fn(),
  create: jest.fn(),
  getById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  getByName: jest.fn(),
  checkName: jest.fn(),
  getOnlyById: jest.fn(),
  getAllMonthly: jest.fn(),
  createAmount: jest.fn(),
  addAmount: jest.fn(),
  getAmount: jest.fn(),
  getUsedByEnvelopeID: jest.fn(),
  getAnalyticsCurrentEnvelopes: jest.fn(),
  getTotalPercentage: jest.fn(),
});

const makeRequest = (overrides = {}) => ({
  userId: 'user-uuid',
  name: 'Alimentação',
  color: '#ff5733',
  order: 1,
  percentage: 30,
  ...overrides,
});

describe('CreateEnvelopeUseCase', () => {
  let useCase: CreateUseCase;
  let repo: jest.Mocked<IEnvelopeRepo>;

  beforeEach(() => {
    repo = makeRepo();
    useCase = new CreateUseCase(repo);
  });

  describe('errors', () => {
    it('deve retornar falha quando name é inválido (muito curto)', async () => {
      const result = await useCase.execute(makeRequest({ name: 'A' }));
      expect(result.isLeft()).toBe(true);
      expect(repo.checkName).not.toHaveBeenCalled();
    });

    it('deve retornar falha quando color é inválida', async () => {
      const result = await useCase.execute(makeRequest({ color: '#fff' }));
      expect(result.isLeft()).toBe(true);
      expect(repo.checkName).not.toHaveBeenCalled();
    });

    it('deve retornar falha quando percentage é inválida (> 100)', async () => {
      const result = await useCase.execute(makeRequest({ percentage: 150 }));
      expect(result.isLeft()).toBe(true);
      expect(repo.checkName).not.toHaveBeenCalled();
    });

    it('deve retornar NameTakenError quando nome já existe', async () => {
      repo.checkName.mockResolvedValue(true);
      const result = await useCase.execute(makeRequest());
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(CreateErrors.NameTakenError);
      expect(repo.create).not.toHaveBeenCalled();
    });

    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      repo.checkName.mockRejectedValue(new Error('DB offline'));
      const result = await useCase.execute(makeRequest());
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve criar envelope com sucesso', async () => {
      repo.checkName.mockResolvedValue(false);
      repo.create.mockResolvedValue(undefined);
      const result = await useCase.execute(makeRequest());
      expect(result.isRight()).toBe(true);
      expect(repo.create).toHaveBeenCalledTimes(1);
    });

    it('deve criar envelope com os valores corretos', async () => {
      repo.checkName.mockResolvedValue(false);
      repo.create.mockResolvedValue(undefined);
      await useCase.execute(makeRequest());
      const [envelope] = repo.create.mock.calls[0];
      expect(envelope.name.value).toBe('Alimentação');
      expect(envelope.color.value).toBe('#ff5733');
      expect(envelope.percentage.value).toBe(30);
    });
  });
});
