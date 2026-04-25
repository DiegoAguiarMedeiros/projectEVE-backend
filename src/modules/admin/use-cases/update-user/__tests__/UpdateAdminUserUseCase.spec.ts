import { UpdateAdminUserUseCase } from '../UpdateAdminUserUseCase';
import { AppError } from '../../../../../shared/core/AppError';

jest.mock('../../../../../shared/infrastructure/database/sequelize/models', () => ({
  Users: {
    update: jest.fn(),
  },
}));

import models from '../../../../../shared/infrastructure/database/sequelize/models';

describe('UpdateAdminUserUseCase', () => {
  let useCase: UpdateAdminUserUseCase;
  let mockUpdate: jest.Mock;

  beforeEach(() => {
    useCase = new UpdateAdminUserUseCase();
    mockUpdate = (models as any).Users.update as jest.Mock;
    mockUpdate.mockReset();
  });

  describe('errors', () => {
    it('deve retornar UnexpectedError quando models lança exceção', async () => {
      mockUpdate.mockRejectedValue(new Error('DB error'));

      const result = await useCase.execute({ userId: 'user-uuid', isDeleted: true });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve atualizar isDeleted quando fornecido', async () => {
      mockUpdate.mockResolvedValue([1]);

      const result = await useCase.execute({ userId: 'user-uuid', isDeleted: true });

      expect(result.isRight()).toBe(true);
      expect(mockUpdate).toHaveBeenCalledWith(
        { is_deleted: true },
        { where: { id: 'user-uuid' } }
      );
    });

    it('deve atualizar isAdminUser quando fornecido', async () => {
      mockUpdate.mockResolvedValue([1]);

      await useCase.execute({ userId: 'user-uuid', isAdminUser: true });

      expect(mockUpdate).toHaveBeenCalledWith(
        { is_admin_user: true },
        { where: { id: 'user-uuid' } }
      );
    });

    it('deve atualizar isEmailVerified quando fornecido', async () => {
      mockUpdate.mockResolvedValue([1]);

      await useCase.execute({ userId: 'user-uuid', isEmailVerified: true });

      expect(mockUpdate).toHaveBeenCalledWith(
        { is_email_verified: true },
        { where: { id: 'user-uuid' } }
      );
    });

    it('deve atualizar múltiplos campos ao mesmo tempo', async () => {
      mockUpdate.mockResolvedValue([1]);

      await useCase.execute({ userId: 'user-uuid', isDeleted: false, isAdminUser: true });

      expect(mockUpdate).toHaveBeenCalledWith(
        { is_deleted: false, is_admin_user: true },
        { where: { id: 'user-uuid' } }
      );
    });

    it('não deve incluir campos undefined no updateData', async () => {
      mockUpdate.mockResolvedValue([1]);

      await useCase.execute({ userId: 'user-uuid' });

      expect(mockUpdate).toHaveBeenCalledWith({}, { where: { id: 'user-uuid' } });
    });
  });
});
