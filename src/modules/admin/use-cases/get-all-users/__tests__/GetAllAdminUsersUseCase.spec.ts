import { GetAllAdminUsersUseCase } from '../GetAllAdminUsersUseCase';
import { Interface as IUserRepo } from '../../../../users/repos/Interface';
import { AppError } from '../../../../../shared/core/AppError';

const makeUserStub = (overrides: Partial<any> = {}) => ({
  id: { toString: () => 'user-uuid' },
  name: { value: 'João Silva' },
  email: { value: 'joao@email.com' },
  isEmailVerified: true,
  isAdminUser: false,
  isDeleted: false,
  isRegistrationComplete: true,
  props: { createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  ...overrides,
});

const makeUserRepo = (): jest.Mocked<Pick<IUserRepo, 'findAll'>> => ({
  findAll: jest.fn(),
});

describe('GetAllAdminUsersUseCase', () => {
  let useCase: GetAllAdminUsersUseCase;
  let userRepo: jest.Mocked<any>;

  beforeEach(() => {
    userRepo = makeUserRepo();
    useCase = new GetAllAdminUsersUseCase(userRepo);
  });

  describe('errors', () => {
    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      userRepo.findAll.mockRejectedValue(new Error('DB error'));

      const result = await useCase.execute({});

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve retornar lista de usuários com paginação padrão', async () => {
      const users = [makeUserStub(), makeUserStub({ id: { toString: () => 'user-2' } })];
      userRepo.findAll.mockResolvedValue({ users, total: 2 });

      const result = await useCase.execute({});

      expect(result.isRight()).toBe(true);
      const response = result.value.getValue() as any;
      expect(response.users).toHaveLength(2);
      expect(response.total).toBe(2);
      expect(response.page).toBe(1);
      expect(response.limit).toBe(20);
    });

    it('deve aplicar page e limit customizados', async () => {
      userRepo.findAll.mockResolvedValue({ users: [], total: 50 });

      await useCase.execute({ page: 2, limit: 10 });

      expect(userRepo.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ page: 2, limit: 10 })
      );
    });

    it('deve repassar filtros search, isDeleted, isAdmin', async () => {
      userRepo.findAll.mockResolvedValue({ users: [], total: 0 });

      await useCase.execute({ search: 'João', isDeleted: false, isAdmin: true });

      expect(userRepo.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ search: 'João', isDeleted: false, isAdmin: true })
      );
    });

    it('deve mapear campos do usuário para AdminUserDTO', async () => {
      const user = makeUserStub();
      userRepo.findAll.mockResolvedValue({ users: [user], total: 1 });

      const result = await useCase.execute({});

      const dto = (result.value.getValue() as any).users[0];
      expect(dto.id).toBe('user-uuid');
      expect(dto.name).toBe('João Silva');
      expect(dto.email).toBe('joao@email.com');
      expect(dto.isEmailVerified).toBe(true);
      expect(dto.isAdminUser).toBe(false);
    });
  });
});
