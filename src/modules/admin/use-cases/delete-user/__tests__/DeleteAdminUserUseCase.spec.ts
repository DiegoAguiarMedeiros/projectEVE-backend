import { DeleteAdminUserUseCase } from '../DeleteAdminUserUseCase';
import { Interface as IUserRepo } from '../../../../users/repos/Interface';
import { AppError } from '../../../../../shared/core/AppError';

const makeUserRepo = (): jest.Mocked<Pick<IUserRepo, 'delete'>> => ({
  delete: jest.fn(),
});

describe('DeleteAdminUserUseCase', () => {
  let useCase: DeleteAdminUserUseCase;
  let userRepo: jest.Mocked<any>;

  beforeEach(() => {
    userRepo = makeUserRepo();
    useCase = new DeleteAdminUserUseCase(userRepo);
  });

  describe('errors', () => {
    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      userRepo.delete.mockRejectedValue(new Error('DB error'));

      const result = await useCase.execute({ userId: 'user-uuid' });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve deletar usuário e retornar sucesso', async () => {
      userRepo.delete.mockResolvedValue(undefined);

      const result = await useCase.execute({ userId: 'user-uuid' });

      expect(result.isRight()).toBe(true);
      expect(userRepo.delete).toHaveBeenCalledWith('user-uuid');
    });
  });
});
