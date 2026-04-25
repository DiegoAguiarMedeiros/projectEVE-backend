import { IncomesMap } from '../index';

const rawDb = {
  id: 'income-uuid',
  user_id: 'user-uuid',
  description: 'Salário mensal',
  amount: 5000,
  payment_day: 5,
};

describe('IncomesMap', () => {
  describe('toDomain()', () => {
    it('deve mapear raw DB para entidade Incomes', () => {
      const income = IncomesMap.toDomain(rawDb);
      expect(income.id.toString()).toBe('income-uuid');
      expect(income.description.value).toBe('Salário mensal');
      expect(income.amount.value).toBe(5000);
      expect(income.paymentDay.value).toBe(5);
    });

    it('deve preservar o id corretamente', () => {
      const income = IncomesMap.toDomain({ ...rawDb, id: 'outro-uuid' });
      expect(income.id.toString()).toBe('outro-uuid');
    });
  });

  describe('toDTO()', () => {
    it('deve mapear Incomes para DTO serializável', () => {
      const income = IncomesMap.toDomain(rawDb);
      const dto = IncomesMap.toDTO(income);
      expect(dto.id).toBe('income-uuid');
      expect(dto.description).toBe('Salário mensal');
      expect(dto.amount).toBe(5000);
      expect(dto.paymentDay).toBe(5);
      expect(typeof dto.userId).toBe('string');
    });
  });

  describe('toPersistence()', () => {
    it('deve mapear Incomes para formato snake_case de banco', async () => {
      const income = IncomesMap.toDomain(rawDb);
      const persistence = await IncomesMap.toPersistence(income);
      expect(persistence.id).toBe('income-uuid');
      expect(persistence.description).toBe('Salário mensal');
      expect(persistence.amount).toBe(5000);
      expect(persistence.payment_day).toBe(5);
      expect(persistence.user_id).toBeDefined();
    });
  });
});
