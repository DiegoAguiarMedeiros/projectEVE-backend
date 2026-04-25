import { ProcessedIncomesMap } from '../index';

const rawDb = {
  id: 'pi-uuid',
  user_id: 'user-uuid',
  description: 'Processamento março',
  day: 5,
  month: 3,
  year: 2026,
  total_income_processed: 5000,
  processed_at: new Date('2026-03-05'),
  is_reprocessed: false,
  is_splitted: false,
  should_add_fixed_expenses: true,
  aux_id: null,
};

describe('ProcessedIncomesMap', () => {
  describe('toDomain()', () => {
    it('deve mapear raw DB para entidade ProcessedIncomes', () => {
      const pi = ProcessedIncomesMap.toDomain(rawDb);
      expect(pi.id.toString()).toBe('pi-uuid');
      expect(pi.description.value).toBe('Processamento março');
      expect(pi.day.value).toBe(5);
      expect(pi.month.value).toBe(3);
      expect(pi.year.value).toBe(2026);
      expect(pi.totalIncomeProcessed.value).toBe(5000);
      expect(pi.isReprocessed).toBe(false);
      expect(pi.isSplitted).toBe(false);
    });

    it('deve mapear auxId quando presente', () => {
      const pi = ProcessedIncomesMap.toDomain({ ...rawDb, aux_id: 'aux-uuid' });
      expect(pi.auxId).toBeDefined();
    });

    it('deve deixar auxId undefined quando nulo', () => {
      const pi = ProcessedIncomesMap.toDomain(rawDb);
      expect(pi.auxId).toBeUndefined();
    });
  });

  describe('toDTO()', () => {
    it('deve mapear ProcessedIncomes para DTO serializável', () => {
      const pi = ProcessedIncomesMap.toDomain(rawDb);
      const dto = ProcessedIncomesMap.toDTO(pi);
      expect(dto.id).toBe('pi-uuid');
      expect(dto.day).toBe(5);
      expect(dto.month).toBe(3);
      expect(dto.year).toBe(2026);
      expect(dto.totalIncomeProcessed).toBe(5000);
      expect(dto.isReprocessed).toBe(false);
    });
  });

  describe('toPersistence()', () => {
    it('deve mapear ProcessedIncomes para formato snake_case de banco', async () => {
      const pi = ProcessedIncomesMap.toDomain(rawDb);
      const persistence = await ProcessedIncomesMap.toPersistence(pi);
      expect(persistence.id).toBe('pi-uuid');
      expect(persistence.day).toBe(5);
      expect(persistence.month).toBe(3);
      expect(persistence.year).toBe(2026);
      expect(persistence.total_income_processed).toBe(5000);
      expect(persistence.is_reprocessed).toBe(false);
      expect(persistence.is_splitted).toBe(false);
      expect(persistence.should_add_fixed_expenses).toBe(true);
    });
  });
});
