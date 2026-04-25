import { GetUserSummaryAdminUseCase } from '../GetUserSummaryAdminUseCase';
import { AppError } from '../../../../../shared/core/AppError';

jest.mock('../../../../../shared/infrastructure/database/sequelize/models', () => ({
  Envelopes: { count: jest.fn(), findAll: jest.fn() },
  Incomes: { count: jest.fn() },
  Transactions: { count: jest.fn() },
  ProcessedIncome: { count: jest.fn() },
}));

import models from '../../../../../shared/infrastructure/database/sequelize/models';

describe('GetUserSummaryAdminUseCase', () => {
  let useCase: GetUserSummaryAdminUseCase;

  beforeEach(() => {
    useCase = new GetUserSummaryAdminUseCase();
    jest.clearAllMocks();
  });

  describe('errors', () => {
    it('deve retornar UnexpectedError quando models lança exceção', async () => {
      (models as any).Envelopes.count.mockRejectedValue(new Error('DB error'));

      const result = await useCase.execute({ userId: 'user-uuid' });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve retornar UserSummaryDTO com contagens corretas', async () => {
      (models as any).Envelopes.count.mockResolvedValue(5);
      (models as any).Envelopes.findAll.mockResolvedValue([
        { id: 'env-1' }, { id: 'env-2' },
      ]);
      (models as any).Incomes.count.mockResolvedValue(10);
      (models as any).ProcessedIncome.count.mockResolvedValue(8);
      (models as any).Transactions.count.mockResolvedValue(120);

      const result = await useCase.execute({ userId: 'user-uuid' });

      expect(result.isRight()).toBe(true);
      const dto = result.value.getValue() as any;
      expect(dto.totalEnvelopes).toBe(5);
      expect(dto.totalIncomes).toBe(10);
      expect(dto.totalProcessedIncomes).toBe(8);
      expect(dto.totalTransactions).toBe(120);
    });

    it('deve retornar totalTransactions=0 quando usuário não tem envelopes', async () => {
      (models as any).Envelopes.count.mockResolvedValue(0);
      (models as any).Envelopes.findAll.mockResolvedValue([]);
      (models as any).Incomes.count.mockResolvedValue(0);
      (models as any).ProcessedIncome.count.mockResolvedValue(0);

      const result = await useCase.execute({ userId: 'user-uuid' });

      expect(result.isRight()).toBe(true);
      expect((result.value.getValue() as any).totalTransactions).toBe(0);
      expect((models as any).Transactions.count).not.toHaveBeenCalled();
    });

    it('deve filtrar contagens por userId', async () => {
      (models as any).Envelopes.count.mockResolvedValue(3);
      (models as any).Envelopes.findAll.mockResolvedValue([{ id: 'env-1' }]);
      (models as any).Incomes.count.mockResolvedValue(5);
      (models as any).ProcessedIncome.count.mockResolvedValue(2);
      (models as any).Transactions.count.mockResolvedValue(50);

      await useCase.execute({ userId: 'user-abc' });

      expect((models as any).Envelopes.count).toHaveBeenCalledWith(
        expect.objectContaining({ where: { user_id: 'user-abc' } })
      );
      expect((models as any).Incomes.count).toHaveBeenCalledWith(
        expect.objectContaining({ where: { user_id: 'user-abc' } })
      );
    });
  });
});
