import { GetUserEnvelopesAdminUseCase } from '../GetUserEnvelopesAdminUseCase';
import { AppError } from '../../../../../shared/core/AppError';

jest.mock('../../../../../shared/infrastructure/database/sequelize/models', () => ({
  Envelopes: { findAll: jest.fn() },
}));

import models from '../../../../../shared/infrastructure/database/sequelize/models';

const makeEnvelopeRow = (overrides: Partial<any> = {}) => ({
  id: 'env-uuid',
  name: 'Moradia',
  color: '#8E33FF',
  order: 1,
  percentage: 30,
  ...overrides,
});

describe('GetUserEnvelopesAdminUseCase', () => {
  let useCase: GetUserEnvelopesAdminUseCase;
  let mockFindAll: jest.Mock;

  beforeEach(() => {
    useCase = new GetUserEnvelopesAdminUseCase();
    mockFindAll = (models as any).Envelopes.findAll as jest.Mock;
    mockFindAll.mockReset();
  });

  describe('errors', () => {
    it('deve retornar UnexpectedError quando models lança exceção', async () => {
      mockFindAll.mockRejectedValue(new Error('DB error'));

      const result = await useCase.execute({ userId: 'user-uuid' });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve retornar lista de envelopes do usuário', async () => {
      const rows = [
        makeEnvelopeRow(),
        makeEnvelopeRow({ id: 'env-2', name: 'Mercado', order: 2 }),
      ];
      mockFindAll.mockResolvedValue(rows);

      const result = await useCase.execute({ userId: 'user-uuid' });

      expect(result.isRight()).toBe(true);
      const dtos = result.value.getValue() as any[];
      expect(dtos).toHaveLength(2);
      expect(dtos[0].name).toBe('Moradia');
      expect(dtos[0].percentage).toBe(30);
    });

    it('deve filtrar por userId ao buscar envelopes', async () => {
      mockFindAll.mockResolvedValue([]);

      await useCase.execute({ userId: 'user-abc' });

      expect(mockFindAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: { user_id: 'user-abc' } })
      );
    });

    it('deve retornar lista vazia quando usuário não tem envelopes', async () => {
      mockFindAll.mockResolvedValue([]);

      const result = await useCase.execute({ userId: 'user-uuid' });

      expect(result.isRight()).toBe(true);
      expect((result.value.getValue() as any[]).length).toBe(0);
    });

    it('deve mapear campos corretamente para UserEnvelopeDTO', async () => {
      mockFindAll.mockResolvedValue([makeEnvelopeRow()]);

      const result = await useCase.execute({ userId: 'user-uuid' });

      const dto = (result.value.getValue() as any[])[0];
      expect(dto).toHaveProperty('id', 'env-uuid');
      expect(dto).toHaveProperty('name', 'Moradia');
      expect(dto).toHaveProperty('color', '#8E33FF');
      expect(dto).toHaveProperty('order', 1);
      expect(dto).toHaveProperty('percentage', 30);
    });
  });
});
