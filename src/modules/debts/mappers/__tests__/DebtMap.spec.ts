import { DebtMap } from '../index';

const rawDb = {
  id: 'debt-uuid',
  description: 'Financiamento carro',
  amount: 800,
  installments_total: 48,
  installments_paid: 6,
  payment_day: 10,
  status: 'debt.status.pending',
  envelope_id: 'env-uuid',
};

describe('DebtMap', () => {
  describe('toDomain()', () => {
    it('deve mapear raw DB para entidade Debt', () => {
      const debt = DebtMap.toDomain(rawDb);
      expect(debt.id.toString()).toBe('debt-uuid');
      expect(debt.description.value).toBe('Financiamento carro');
      expect(debt.amount.value).toBe(800);
      expect(debt.installmentsTotal.value).toBe(48);
      expect(debt.installmentsPaid.value).toBe(6);
      expect(debt.paymentDay.value).toBe(10);
      expect(debt.status).toBe('debt.status.pending');
    });
  });

  describe('toDTO()', () => {
    it('deve mapear Debt para DTO serializável', () => {
      const debt = DebtMap.toDomain(rawDb);
      const dto = DebtMap.toDTO(debt);
      expect(dto.id).toBe('debt-uuid');
      expect(dto.description).toBe('Financiamento carro');
      expect(typeof dto.amount).toBe('number');
      expect(dto.installmentsTotal).toBe(48);
      expect(dto.installmentsPaid).toBe(6);
      expect(dto.paymentDay).toBe(10);
      expect(dto.status).toBe('debt.status.pending');
    });
  });

  describe('toPersistence()', () => {
    it('deve mapear Debt para formato snake_case de banco', async () => {
      const debt = DebtMap.toDomain(rawDb);
      const persistence = await DebtMap.toPersistence(debt);
      expect(persistence.id).toBe('debt-uuid');
      expect(persistence.installments_total).toBe(48);
      expect(persistence.installments_paid).toBe(6);
      expect(persistence.payment_day).toBe(10);
      expect(persistence.envelope_id).toBeDefined();
    });
  });
});
