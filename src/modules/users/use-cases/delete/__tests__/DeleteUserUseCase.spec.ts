import { DeleteUserUseCase } from '../DeleteUserUseCase';
import { AppError } from '../../../../../shared/core/AppError';
import { Interface as IUserRepo } from '../../../repos/Interface';

const makeRepo = (): jest.Mocked<Pick<IUserRepo, 'delete'>> => ({
  delete: jest.fn(),
});

describe('DeleteUserUseCase', () => {
  let useCase: DeleteUserUseCase;
  let repo: jest.Mocked<any>;

  beforeEach(() => {
    repo = makeRepo();
    useCase = new DeleteUserUseCase(repo as any);
  });

  describe('errors', () => {
    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      repo.delete.mockRejectedValue(new Error('DB offline'));
      const result = await useCase.execute({ userId: 'user-uuid' });
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve deletar usuário com sucesso', async () => {
      repo.delete.mockResolvedValue(undefined);
      const result = await useCase.execute({ userId: 'user-uuid' });
      expect(result.isRight()).toBe(true);
    });

    it('deve chamar repo.delete com userId correto', async () => {
      repo.delete.mockResolvedValue(undefined);
      await useCase.execute({ userId: 'user-uuid' });
      expect(repo.delete).toHaveBeenCalledWith('user-uuid');
    });
  });
});
