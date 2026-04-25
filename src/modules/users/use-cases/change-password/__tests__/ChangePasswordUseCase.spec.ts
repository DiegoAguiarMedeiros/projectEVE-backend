import { ChangePasswordUseCase } from '../ChangePasswordUseCase';
import { ChangePasswordErrors } from '../ChangePasswordErrors';
import { AppError } from '../../../../../shared/core/AppError';
import { Interface as IUserRepo } from '../../../repos/Interface';
import { UserMap } from '../../../mappers';

const makeRepo = (): jest.Mocked<Pick<IUserRepo, 'getUserByUserId' | 'save'>> => ({
  getUserByUserId: jest.fn(),
  save: jest.fn(),
});

const rawUser = {
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

describe('ChangePasswordUseCase', () => {
  let useCase: ChangePasswordUseCase;
  let repo: jest.Mocked<any>;

  beforeEach(() => {
    repo = makeRepo();
    useCase = new ChangePasswordUseCase(repo as any);
  });

  describe('errors', () => {
    it('deve retornar IncorrectPasswordError quando senha atual está errada', async () => {
      const user = UserMap.toDomain(rawUser);
      jest.spyOn(user.password, 'comparePassword').mockResolvedValue(false);
      repo.getUserByUserId.mockResolvedValue(user);

      const result = await useCase.execute({
        userId: 'user-uuid',
        currentPassword: 'WrongPass@123',
        newPassword: 'NewPass@456',
      });
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(ChangePasswordErrors.IncorrectPasswordError);
      expect(repo.save).not.toHaveBeenCalled();
    });

    it('deve retornar falha quando nova senha é inválida', async () => {
      const user = UserMap.toDomain(rawUser);
      jest.spyOn(user.password, 'comparePassword').mockResolvedValue(true);
      repo.getUserByUserId.mockResolvedValue(user);

      const result = await useCase.execute({
        userId: 'user-uuid',
        currentPassword: 'TestPass@123',
        newPassword: '',
      });
      expect(result.isLeft()).toBe(true);
      expect(repo.save).not.toHaveBeenCalled();
    });

    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      repo.getUserByUserId.mockRejectedValue(new Error('DB offline'));
      const result = await useCase.execute({
        userId: 'user-uuid',
        currentPassword: 'TestPass@123',
        newPassword: 'NewPass@456',
      });
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve alterar senha com sucesso', async () => {
      const user = UserMap.toDomain(rawUser);
      jest.spyOn(user.password, 'comparePassword').mockResolvedValue(true);
      repo.getUserByUserId.mockResolvedValue(user);
      repo.save.mockResolvedValue(undefined);

      const result = await useCase.execute({
        userId: 'user-uuid',
        currentPassword: 'TestPass@123',
        newPassword: 'NewPass@456',
      });
      expect(result.isRight()).toBe(true);
      expect(repo.save).toHaveBeenCalledTimes(1);
    });
  });
});
