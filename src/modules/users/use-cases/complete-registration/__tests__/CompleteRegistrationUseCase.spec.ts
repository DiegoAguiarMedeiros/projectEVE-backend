import { CompleteRegistrationUseCase } from '../CompleteRegistrationUseCase';
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
  is_registration_complete: false,
  email_verification_token: null,
  email_verification_token_expires_at: null,
};

describe('CompleteRegistrationUseCase', () => {
  let useCase: CompleteRegistrationUseCase;
  let repo: jest.Mocked<any>;

  beforeEach(() => {
    repo = makeRepo();
    useCase = new CompleteRegistrationUseCase(repo as any);
  });

  describe('errors', () => {
    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      repo.getUserByUserId.mockRejectedValue(new Error('DB offline'));
      const result = await useCase.execute('user-uuid');
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve completar registro com sucesso', async () => {
      repo.getUserByUserId.mockResolvedValue(UserMap.toDomain(rawUser));
      repo.save.mockResolvedValue(undefined);
      const result = await useCase.execute('user-uuid');
      expect(result.isRight()).toBe(true);
      expect(repo.save).toHaveBeenCalledTimes(1);
    });

    it('deve marcar registro como completo antes de salvar', async () => {
      repo.getUserByUserId.mockResolvedValue(UserMap.toDomain(rawUser));
      repo.save.mockResolvedValue(undefined);
      await useCase.execute('user-uuid');
      const [savedUser] = repo.save.mock.calls[0];
      expect(savedUser.isRegistrationComplete).toBe(true);
    });
  });
});
