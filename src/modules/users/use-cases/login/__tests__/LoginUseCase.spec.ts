import { LoginUserUseCase } from '../LoginUseCase';
import { LoginUseCaseErrors } from '../LoginErrors';
import { AppError } from '../../../../../shared/core/AppError';
import { Interface as IUserRepo } from '../../../repos/Interface';
import { IAuthService } from '../../../../../shared/infrastructure/services/authService';
import { UserMap } from '../../../mappers';

jest.mock('../../../../../shared/infrastructure/services/EmailService', () => ({
  emailService: { sendVerificationEmail: jest.fn().mockResolvedValue(undefined) },
}));

const rawVerifiedUser = {
  id: 'user-uuid',
  name: 'João Silva',
  email: 'joao@exemplo.com',
  password: '$2a$10$hashedpassword',
  is_admin_user: false,
  is_deleted: false,
  is_email_verified: true,
  is_registration_complete: true,
  email_verification_token: null,
  email_verification_token_expires_at: null,
};

const rawUnverifiedUser = {
  ...rawVerifiedUser,
  is_email_verified: false,
  email_verification_token: 'tok-abc',
  email_verification_token_expires_at: new Date(Date.now() + 86400000).toISOString(),
};

const makeRepo = (): jest.Mocked<Pick<IUserRepo, 'getUserByEmail' | 'save'>> => ({
  getUserByEmail: jest.fn(),
  save: jest.fn(),
});

const makeAuthService = (): jest.Mocked<IAuthService> => ({
  signJWT: jest.fn().mockReturnValue('jwt-token'),
  decodeJWT: jest.fn(),
  createRefreshToken: jest.fn().mockReturnValue('refresh-token'),
  getTokens: jest.fn(),
  saveAuthenticatedUser: jest.fn().mockResolvedValue(undefined),
  deAuthenticateUser: jest.fn(),
  refreshTokenExists: jest.fn(),
  getIdFromRefreshToken: jest.fn(),
});

const makeRequest = (overrides = {}) => ({
  email: 'joao@exemplo.com',
  password: 'TestPass@123',
  isRegistrationComplete: true,
  ...overrides,
});

describe('LoginUserUseCase', () => {
  let useCase: LoginUserUseCase;
  let repo: jest.Mocked<any>;
  let authService: jest.Mocked<IAuthService>;

  beforeEach(() => {
    repo = makeRepo();
    authService = makeAuthService();
    useCase = new LoginUserUseCase(repo as any, authService);
  });

  describe('errors', () => {
    it('deve retornar falha quando email é inválido', async () => {
      const result = await useCase.execute(makeRequest({ email: 'not-an-email' }));
      expect(result.isLeft()).toBe(true);
    });

    it('deve retornar EmailDoesntExistError quando usuário não existe', async () => {
      repo.getUserByEmail.mockRejectedValue(new Error('not found'));
      const result = await useCase.execute(makeRequest());
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(LoginUseCaseErrors.EmailDoesntExistError);
    });

    it('deve retornar EmailDoesntExistError quando senha está errada', async () => {
      const user = UserMap.toDomain(rawVerifiedUser);
      jest.spyOn(user.password, 'comparePassword').mockResolvedValue(false);
      repo.getUserByEmail.mockResolvedValue(user);
      const result = await useCase.execute(makeRequest());
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(LoginUseCaseErrors.EmailDoesntExistError);
    });

    it('deve retornar EmailNotVerifiedError quando email não está verificado', async () => {
      const user = UserMap.toDomain(rawUnverifiedUser);
      jest.spyOn(user.password, 'comparePassword').mockResolvedValue(true);
      repo.getUserByEmail.mockResolvedValue(user);
      repo.save.mockResolvedValue(undefined);
      const result = await useCase.execute(makeRequest());
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(LoginUseCaseErrors.EmailNotVerifiedError);
    });
  });

  describe('success', () => {
    it('deve fazer login com sucesso retornando accessToken e refreshToken', async () => {
      const user = UserMap.toDomain(rawVerifiedUser);
      jest.spyOn(user.password, 'comparePassword').mockResolvedValue(true);
      repo.getUserByEmail.mockResolvedValue(user);

      const result = await useCase.execute(makeRequest());
      expect(result.isRight()).toBe(true);
      const data = (result.value as any).getValue();
      expect(data.accessToken).toBe('jwt-token');
      expect(data.refreshToken).toBe('refresh-token');
    });

    it('deve chamar authService.signJWT e saveAuthenticatedUser', async () => {
      const user = UserMap.toDomain(rawVerifiedUser);
      jest.spyOn(user.password, 'comparePassword').mockResolvedValue(true);
      repo.getUserByEmail.mockResolvedValue(user);

      await useCase.execute(makeRequest());
      expect(authService.signJWT).toHaveBeenCalledTimes(1);
      expect(authService.saveAuthenticatedUser).toHaveBeenCalledTimes(1);
    });
  });
});
