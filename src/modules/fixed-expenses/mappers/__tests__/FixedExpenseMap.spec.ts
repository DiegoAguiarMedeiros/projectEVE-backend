import { FixedExpenseMap } from '../index';

const rawDb = {
  id: 'fe-uuid',
  envelope_id: 'env-uuid',
  description: 'Conta de internet',
  amount: 120,
  payment_day: 10,
};

describe('FixedExpenseMap', () => {
  describe('toDomain()', () => {
    it('deve mapear raw DB para entidade FixedExpense', () => {
      const fe = FixedExpenseMap.toDomain(rawDb);
      expect(fe.id.toString()).toBe('fe-uuid');
      expect(fe.description.value).toBe('Conta de internet');
      expect(fe.amount.value).toBe(120);
      expect(fe.paymentDay.value).toBe(10);
    });
  });

  describe('toDTO()', () => {
    it('deve mapear FixedExpense para DTO serializável', () => {
      const fe = FixedExpenseMap.toDomain(rawDb);
      const dto = FixedExpenseMap.toDTO(fe);
      expect(dto.id).toBe('fe-uuid');
      expect(dto.description).toBe('Conta de internet');
      expect(typeof dto.amount).toBe('number');
      expect(dto.paymentDay).toBe(10);
      expect(typeof dto.envelopeId).toBe('string');
    });
  });

  describe('toPersistence()', () => {
    it('deve mapear FixedExpense para formato snake_case de banco', async () => {
      const fe = FixedExpenseMap.toDomain(rawDb);
      const persistence = await FixedExpenseMap.toPersistence(fe);
      expect(persistence.id).toBe('fe-uuid');
      expect(persistence.envelope_id).toBeDefined();
      expect(persistence.description).toBe('Conta de internet');
      expect(persistence.amount).toBe(120);
      expect(persistence.payment_day).toBe(10);
    });
  });
});
