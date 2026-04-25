import { CreateUseCase } from '../CreateUseCase';
import { CreateErrors } from '../CreateErrors';
import { AppError } from '../../../../../shared/core/AppError';
import { Interface as IUserRepo } from '../../../repos/Interface';

const makeRepo = (): jest.Mocked<Pick<IUserRepo, 'exists' | 'create'>> => ({
  exists: jest.fn(),
  create: jest.fn(),
});

const makeRequest = (overrides = {}) => ({
  email: 'joao@exemplo.com',
  password: 'TestPass@123',
  name: 'João Silva',
  isRegistrationComplete: false,
  ...overrides,
});

describe('CreateUserUseCase', () => {
  let useCase: CreateUseCase;
  let repo: jest.Mocked<any>;

  beforeEach(() => {
    repo = makeRepo();
    useCase = new CreateUseCase(repo as any);
  });

  describe('errors', () => {
    it('deve retornar falha quando email é inválido', async () => {
      const result = await useCase.execute(makeRequest({ email: 'not-an-email' }));
      expect(result.isLeft()).toBe(true);
      expect(repo.exists).not.toHaveBeenCalled();
    });

    it('deve retornar falha quando name é muito curto', async () => {
      const result = await useCase.execute(makeRequest({ name: 'A' }));
      expect(result.isLeft()).toBe(true);
      expect(repo.exists).not.toHaveBeenCalled();
    });

    it('deve retornar EmailAlreadyExistsError quando email já existe', async () => {
      repo.exists.mockResolvedValue(true);
      const result = await useCase.execute(makeRequest());
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(CreateErrors.EmailAlreadyExistsError);
      expect(repo.create).not.toHaveBeenCalled();
    });

    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      repo.exists.mockRejectedValue(new Error('DB offline'));
      const result = await useCase.execute(makeRequest());
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve criar usuário com sucesso', async () => {
      repo.exists.mockResolvedValue(false);
      repo.create.mockResolvedValue(undefined);
      const result = await useCase.execute(makeRequest());
      expect(result.isRight()).toBe(true);
      expect(repo.create).toHaveBeenCalledTimes(1);
    });

    it('deve criar usuário com email e nome corretos', async () => {
      repo.exists.mockResolvedValue(false);
      repo.create.mockResolvedValue(undefined);
      await useCase.execute(makeRequest());
      const [user] = repo.create.mock.calls[0];
      expect(user.email.value).toBe('joao@exemplo.com');
      expect(user.name.value).toBe('João Silva');
    });

    it('deve criar usuário com token de verificação de email', async () => {
      repo.exists.mockResolvedValue(false);
      repo.create.mockResolvedValue(undefined);
      await useCase.execute(makeRequest());
      const [user] = repo.create.mock.calls[0];
      expect(user.emailVerificationToken).toBeDefined();
      expect(user.emailVerificationTokenExpiresAt).toBeInstanceOf(Date);
    });
  });
});
