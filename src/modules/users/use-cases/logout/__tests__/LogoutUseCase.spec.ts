import { LogoutUseCase } from '../LogoutUseCase';
import { AppError } from '../../../../../shared/core/AppError';
import { IAuthService } from '../../../../../shared/infrastructure/services/authService';

const makeAuthService = (): jest.Mocked<Pick<IAuthService, 'deAuthenticateUser'>> => ({
  deAuthenticateUser: jest.fn(),
});

describe('LogoutUseCase', () => {
  let useCase: LogoutUseCase;
  let authService: jest.Mocked<any>;

  beforeEach(() => {
    authService = makeAuthService();
    useCase = new LogoutUseCase(authService as any);
  });

  describe('errors', () => {
    it('deve retornar UnexpectedError quando authService lança exceção', async () => {
      authService.deAuthenticateUser.mockRejectedValue(new Error('Redis offline'));
      const result = await useCase.execute('user-uuid');
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve fazer logout com sucesso', async () => {
      authService.deAuthenticateUser.mockResolvedValue(undefined);
      const result = await useCase.execute('user-uuid');
      expect(result.isRight()).toBe(true);
    });

    it('deve chamar deAuthenticateUser com o userId correto', async () => {
      authService.deAuthenticateUser.mockResolvedValue(undefined);
      await useCase.execute('user-uuid');
      expect(authService.deAuthenticateUser).toHaveBeenCalledWith('user-uuid');
    });
  });
});
