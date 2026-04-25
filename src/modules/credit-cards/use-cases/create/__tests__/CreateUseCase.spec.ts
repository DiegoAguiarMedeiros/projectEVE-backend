import { CreateUseCase } from '../CreateUseCase';
import { CreateErrors } from '../CreateErrors';
import { AppError } from '../../../../../shared/core/AppError';
import { Interface as ICreditCardRepo } from '../../../repos/Interface';

const makeRepo = (): jest.Mocked<ICreditCardRepo> => ({
  getAll: jest.fn(),
  create: jest.fn(),
  getById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  checkName: jest.fn(),
  deleteAll: jest.fn(),
});

const makeRequest = (overrides = {}) => ({
  userId: 'user-uuid',
  name: 'Nubank',
  flag: 'Visa' as const,
  active: true,
  ...overrides,
});

describe('CreateCreditCardUseCase', () => {
  let useCase: CreateUseCase;
  let repo: jest.Mocked<ICreditCardRepo>;

  beforeEach(() => {
    repo = makeRepo();
    useCase = new CreateUseCase(repo);
  });

  describe('errors', () => {
    it('deve retornar NameTakenError quando nome já existe', async () => {
      repo.checkName.mockResolvedValue(true);
      const result = await useCase.execute(makeRequest());
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(CreateErrors.NameTakenError);
    });

    it('não deve chamar repo.create quando nome já existe', async () => {
      repo.checkName.mockResolvedValue(true);
      await useCase.execute(makeRequest());
      expect(repo.create).not.toHaveBeenCalled();
    });

    it('deve retornar falha quando name é inválido (muito curto)', async () => {
      const result = await useCase.execute(makeRequest({ name: 'A' }));
      expect(result.isLeft()).toBe(true);
      expect(repo.checkName).not.toHaveBeenCalled();
    });

    it('deve retornar falha quando flag é inválida', async () => {
      const result = await useCase.execute(makeRequest({ flag: 'BandeiraInvalida' }));
      expect(result.isLeft()).toBe(true);
      expect(repo.checkName).not.toHaveBeenCalled();
    });

    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      repo.checkName.mockRejectedValue(new Error('DB offline'));
      const result = await useCase.execute(makeRequest());
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve criar cartão com sucesso', async () => {
      repo.checkName.mockResolvedValue(false);
      repo.create.mockResolvedValue(undefined);
      const result = await useCase.execute(makeRequest());
      expect(result.isRight()).toBe(true);
      expect(repo.create).toHaveBeenCalledTimes(1);
    });

    it('deve criar cartão com os valores corretos', async () => {
      repo.checkName.mockResolvedValue(false);
      repo.create.mockResolvedValue(undefined);
      await useCase.execute(makeRequest());
      const [cc] = repo.create.mock.calls[0];
      expect(cc.name.value).toBe('Nubank');
      expect(cc.flag.value).toBe('Visa');
      expect(cc.active).toBe(true);
    });
  });
});
