import { GetAdminUserByIdUseCase } from '../GetAdminUserByIdUseCase';
import { Interface as IUserRepo } from '../../../../users/repos/Interface';
import { AppError } from '../../../../../shared/core/AppError';

jest.mock('../../../../../shared/infrastructure/database/sequelize/models', () => ({
  Users: {
    findOne: jest.fn(),
  },
}));

import models from '../../../../../shared/infrastructure/database/sequelize/models';

const makeUserStub = () => ({
  id: { toString: () => 'user-uuid' },
  name: { value: 'João Silva' },
  email: { value: 'joao@email.com' },
  isEmailVerified: true,
  isAdminUser: false,
  isDeleted: false,
  isRegistrationComplete: true,
});

const makeUserRepo = (): jest.Mocked<Pick<IUserRepo, 'getUserByUserId'>> => ({
  getUserByUserId: jest.fn(),
});

describe('GetAdminUserByIdUseCase', () => {
  let useCase: GetAdminUserByIdUseCase;
  let userRepo: jest.Mocked<any>;
  let mockFindOne: jest.Mock;

  beforeEach(() => {
    userRepo = makeUserRepo();
    useCase = new GetAdminUserByIdUseCase(userRepo);
    mockFindOne = (models as any).Users.findOne as jest.Mock;
    mockFindOne.mockReset();
  });

  describe('errors', () => {
    it('deve retornar UnexpectedError quando usuário não existe no repo', async () => {
      userRepo.getUserByUserId.mockResolvedValue(null);

      const result = await useCase.execute({ userId: 'user-uuid' });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });

    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      userRepo.getUserByUserId.mockRejectedValue(new Error('DB error'));

      const result = await useCase.execute({ userId: 'user-uuid' });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve retornar AdminUserDTO com dados do usuário', async () => {
      const user = makeUserStub();
      userRepo.getUserByUserId.mockResolvedValue(user);
      mockFindOne.mockResolvedValue({ created_at: '2026-01-01', updated_at: '2026-03-01' });

      const result = await useCase.execute({ userId: 'user-uuid' });

      expect(result.isRight()).toBe(true);
      const dto = result.value.getValue() as any;
      expect(dto.id).toBe('user-uuid');
      expect(dto.name).toBe('João Silva');
      expect(dto.email).toBe('joao@email.com');
      expect(dto.createdAt).toBe('2026-01-01');
    });

    it('deve usar string vazia para createdAt quando raw é null', async () => {
      const user = makeUserStub();
      userRepo.getUserByUserId.mockResolvedValue(user);
      mockFindOne.mockResolvedValue(null);

      const result = await useCase.execute({ userId: 'user-uuid' });

      expect(result.isRight()).toBe(true);
      const dto = result.value.getValue() as any;
      expect(dto.createdAt).toBe('');
    });
  });
});
