import { GetAdminStatsUseCase } from '../GetAdminStatsUseCase';
import { AppError } from '../../../../../shared/core/AppError';

jest.mock('../../../../../shared/infrastructure/database/sequelize/models', () => ({
  Users: { count: jest.fn() },
  Envelopes: { count: jest.fn() },
  Transactions: { count: jest.fn() },
  ProcessedIncome: { count: jest.fn() },
}));

import models from '../../../../../shared/infrastructure/database/sequelize/models';

describe('GetAdminStatsUseCase', () => {
  let useCase: GetAdminStatsUseCase;

  beforeEach(() => {
    useCase = new GetAdminStatsUseCase();
    jest.clearAllMocks();
  });

  describe('errors', () => {
    it('deve retornar UnexpectedError quando models lança exceção', async () => {
      (models as any).Users.count.mockRejectedValue(new Error('DB error'));

      const result = await useCase.execute();

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve retornar AdminStatsDTO com contagens corretas', async () => {
      (models as any).Users.count
        .mockResolvedValueOnce(100)   // totalUsers
        .mockResolvedValueOnce(80)    // activeUsers (is_deleted: false)
        .mockResolvedValueOnce(5)     // adminUsers (is_admin_user: true)
        .mockResolvedValueOnce(20)    // deletedUsers (is_deleted: true)
        .mockResolvedValueOnce(10);   // usersRegisteredThisMonth
      (models as any).Envelopes.count.mockResolvedValue(500);
      (models as any).Transactions.count.mockResolvedValue(2000);
      (models as any).ProcessedIncome.count.mockResolvedValue(300);

      const result = await useCase.execute();

      expect(result.isRight()).toBe(true);
      const dto = result.value.getValue() as any;
      expect(dto.totalUsers).toBe(100);
      expect(dto.activeUsers).toBe(80);
      expect(dto.adminUsers).toBe(5);
      expect(dto.deletedUsers).toBe(20);
      expect(dto.usersRegisteredThisMonth).toBe(10);
      expect(dto.totalEnvelopes).toBe(500);
      expect(dto.totalTransactions).toBe(2000);
      expect(dto.totalProcessedIncomes).toBe(300);
    });

    it('deve executar todas as queries em paralelo (Promise.all)', async () => {
      (models as any).Users.count.mockResolvedValue(0);
      (models as any).Envelopes.count.mockResolvedValue(0);
      (models as any).Transactions.count.mockResolvedValue(0);
      (models as any).ProcessedIncome.count.mockResolvedValue(0);

      await useCase.execute();

      // 5 Users.count calls + 1 Envelopes + 1 Transactions + 1 ProcessedIncome = 8 total
      expect((models as any).Users.count).toHaveBeenCalledTimes(5);
      expect((models as any).Envelopes.count).toHaveBeenCalledTimes(1);
      expect((models as any).Transactions.count).toHaveBeenCalledTimes(1);
      expect((models as any).ProcessedIncome.count).toHaveBeenCalledTimes(1);
    });
  });
});
