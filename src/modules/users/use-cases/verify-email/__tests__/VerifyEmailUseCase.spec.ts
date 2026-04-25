import { VerifyEmailUseCase } from '../VerifyEmailUseCase';
import { VerifyEmailErrors } from '../VerifyEmailErrors';
import { AppError } from '../../../../../shared/core/AppError';
import { Interface as IUserRepo } from '../../../repos/Interface';
import { UserMap } from '../../../mappers';

const makeRepo = (): jest.Mocked<Pick<IUserRepo, 'getUserByVerificationToken' | 'save'>> => ({
  getUserByVerificationToken: jest.fn(),
  save: jest.fn(),
});

const rawUserWithToken = {
  id: 'user-uuid',
  name: 'João Silva',
  email: 'joao@exemplo.com',
  password: '$2a$10$hashedpassword',
  is_admin_user: false,
  is_deleted: false,
  is_email_verified: false,
  is_registration_complete: false,
  email_verification_token: 'valid-token-abc',
  email_verification_token_expires_at: new Date(Date.now() + 86400000).toISOString(),
};

describe('VerifyEmailUseCase', () => {
  let useCase: VerifyEmailUseCase;
  let repo: jest.Mocked<any>;

  beforeEach(() => {
    repo = makeRepo();
    useCase = new VerifyEmailUseCase(repo as any);
  });

  describe('errors', () => {
    it('deve retornar InvalidOrExpiredTokenError quando token não é encontrado', async () => {
      repo.getUserByVerificationToken.mockResolvedValue(null);
      const result = await useCase.execute({ token: 'invalid-token' });
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(VerifyEmailErrors.InvalidOrExpiredTokenError);
    });

    it('deve retornar InvalidOrExpiredTokenError quando token expirou', async () => {
      const expiredUser = UserMap.toDomain({
        ...rawUserWithToken,
        email_verification_token_expires_at: new Date(Date.now() - 1000).toISOString(),
      });
      repo.getUserByVerificationToken.mockResolvedValue(expiredUser);
      const result = await useCase.execute({ token: 'expired-token' });
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(VerifyEmailErrors.InvalidOrExpiredTokenError);
    });

    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      repo.getUserByVerificationToken.mockRejectedValue(new Error('DB offline'));
      const result = await useCase.execute({ token: 'tok' });
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve verificar email com sucesso quando token é válido', async () => {
      repo.getUserByVerificationToken.mockResolvedValue(UserMap.toDomain(rawUserWithToken));
      repo.save.mockResolvedValue(undefined);
      const result = await useCase.execute({ token: 'valid-token-abc' });
      expect(result.isRight()).toBe(true);
      expect(repo.save).toHaveBeenCalledTimes(1);
    });

    it('deve marcar email como verificado antes de salvar', async () => {
      repo.getUserByVerificationToken.mockResolvedValue(UserMap.toDomain(rawUserWithToken));
      repo.save.mockResolvedValue(undefined);
      await useCase.execute({ token: 'valid-token-abc' });
      const [savedUser] = repo.save.mock.calls[0];
      expect(savedUser.isEmailVerified).toBe(true);
    });
  });
});
