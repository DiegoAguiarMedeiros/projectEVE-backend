import { GetStatsByMonthUseCase } from '../GetStatsByMonthUseCase';
import { AppError } from '../../../../../shared/core/AppError';

jest.mock('../../../../../shared/infrastructure/database/sequelize/models', () => ({
  Users: { findAll: jest.fn() },
  Transactions: { findAll: jest.fn() },
}));

import models from '../../../../../shared/infrastructure/database/sequelize/models';

const makeRawRow = (year: number, month: number, count: number) => ({
  year: String(year),
  month: String(month),
  count: String(count),
});

describe('GetStatsByMonthUseCase', () => {
  let useCase: GetStatsByMonthUseCase;

  beforeEach(() => {
    useCase = new GetStatsByMonthUseCase();
    jest.clearAllMocks();
  });

  describe('errors', () => {
    it('deve retornar UnexpectedError quando models lança exceção', async () => {
      (models as any).Users.findAll.mockRejectedValue(new Error('DB error'));

      const result = await useCase.execute({ type: 'users' });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve retornar dados mensais de usuários', async () => {
      const rows = [
        makeRawRow(2026, 1, 5),
        makeRawRow(2026, 2, 8),
        makeRawRow(2026, 3, 12),
      ];
      (models as any).Users.findAll.mockResolvedValue(rows);

      const result = await useCase.execute({ type: 'users' });

      expect(result.isRight()).toBe(true);
      const dtos = result.value.getValue() as any[];
      expect(dtos).toHaveLength(3);
      expect(dtos[0]).toEqual({ year: 2026, month: 1, count: 5 });
      expect(dtos[2]).toEqual({ year: 2026, month: 3, count: 12 });
    });

    it('deve usar model Transactions quando type=transactions', async () => {
      (models as any).Transactions.findAll.mockResolvedValue([makeRawRow(2026, 3, 50)]);

      const result = await useCase.execute({ type: 'transactions' });

      expect(result.isRight()).toBe(true);
      expect((models as any).Transactions.findAll).toHaveBeenCalledTimes(1);
      expect((models as any).Users.findAll).not.toHaveBeenCalled();
    });

    it('deve usar 12 meses como padrão quando months não é fornecido', async () => {
      (models as any).Users.findAll.mockResolvedValue([]);

      await useCase.execute({ type: 'users' });

      expect((models as any).Users.findAll).toHaveBeenCalledTimes(1);
    });

    it('deve converter strings para números no DTO', async () => {
      (models as any).Users.findAll.mockResolvedValue([makeRawRow(2026, 3, 10)]);

      const result = await useCase.execute({ type: 'users' });

      const dto = (result.value.getValue() as any[])[0];
      expect(typeof dto.year).toBe('number');
      expect(typeof dto.month).toBe('number');
      expect(typeof dto.count).toBe('number');
    });
  });
});
