import { UpdateUserUseCase } from '../UpdateUserUseCase';
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

describe('UpdateUserUseCase', () => {
  let useCase: UpdateUserUseCase;
  let repo: jest.Mocked<any>;

  beforeEach(() => {
    repo = makeRepo();
    useCase = new UpdateUserUseCase(repo as any);
  });

  describe('errors', () => {
    it('deve retornar falha quando name é inválido (muito curto)', async () => {
      repo.getUserByUserId.mockResolvedValue(UserMap.toDomain(rawUser));
      const result = await useCase.execute({ userId: 'user-uuid', name: 'A' });
      expect(result.isLeft()).toBe(true);
      expect(repo.save).not.toHaveBeenCalled();
    });

    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      repo.getUserByUserId.mockRejectedValue(new Error('DB offline'));
      const result = await useCase.execute({ userId: 'user-uuid', name: 'Novo Nome' });
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve atualizar nome do usuário com sucesso', async () => {
      repo.getUserByUserId.mockResolvedValue(UserMap.toDomain(rawUser));
      repo.save.mockResolvedValue(undefined);
      const result = await useCase.execute({ userId: 'user-uuid', name: 'Maria Silva' });
      expect(result.isRight()).toBe(true);
      expect(repo.save).toHaveBeenCalledTimes(1);
    });

    it('deve salvar usuário mesmo sem alterar nome (campo omitido)', async () => {
      repo.getUserByUserId.mockResolvedValue(UserMap.toDomain(rawUser));
      repo.save.mockResolvedValue(undefined);
      const result = await useCase.execute({ userId: 'user-uuid' });
      expect(result.isRight()).toBe(true);
      expect(repo.save).toHaveBeenCalledTimes(1);
    });
  });
});
