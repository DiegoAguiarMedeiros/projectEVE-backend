import { TransactionsMap } from '../index';

const rawDb = {
  id: 'tx-uuid',
  envelope_id: 'env-uuid',
  description: 'Compra no mercado',
  amount: 150,
  date: '2026-03-01T00:00:00.000Z',
  type: 'Debit',
  status: 'transaction.status.completed',
  payment_method: 'envelope.transaction.payment_method.Pix',
  processed_incomes_id: null,
  credit_card_id: null,
  debt_id: null,
  credit_card_name: null,
  is_translatable: false,
};

describe('TransactionsMap', () => {
  describe('toDomain()', () => {
    it('deve mapear raw DB para entidade Transactions', () => {
      const tx = TransactionsMap.toDomain(rawDb);
      expect(tx.id.toString()).toBe('tx-uuid');
      expect(tx.description.value).toBe('Compra no mercado');
      expect(tx.amount.value).toBe(150);
      expect(tx.type).toBe('Debit');
      expect(tx.status).toBe('transaction.status.completed');
    });

    it('deve mapear creditCardId quando presente', () => {
      const tx = TransactionsMap.toDomain({ ...rawDb, credit_card_id: 'cc-uuid' });
      expect(tx.creditCardId?.value).toBeDefined();
    });

    it('deve deixar creditCardId undefined quando ausente', () => {
      const tx = TransactionsMap.toDomain(rawDb);
      expect(tx.creditCardId).toBeUndefined();
    });

    it('deve mapear debtId quando presente', () => {
      const tx = TransactionsMap.toDomain({ ...rawDb, debt_id: 'debt-uuid' });
      expect(tx.debtId?.value).toBeDefined();
    });

    it('deve converter date para objeto Date', () => {
      const tx = TransactionsMap.toDomain(rawDb);
      expect(tx.date).toBeInstanceOf(Date);
    });
  });

  describe('toDTO()', () => {
    it('deve mapear Transactions para DTO serializável', () => {
      const tx = TransactionsMap.toDomain(rawDb);
      const dto = TransactionsMap.toDTO(tx);
      expect(dto.id).toBe('tx-uuid');
      expect(dto.description).toBe('Compra no mercado');
      expect(typeof dto.amount).toBe('number');
      expect(dto.type).toBe('Debit');
      expect(dto.isTranslatable).toBe(false);
    });

    it('deve incluir campos opcionais como undefined quando ausentes', () => {
      const tx = TransactionsMap.toDomain(rawDb);
      const dto = TransactionsMap.toDTO(tx);
      expect(dto.creditCardId).toBeUndefined();
      expect(dto.debtId).toBeUndefined();
    });
  });

  describe('toPersistence()', () => {
    it('deve mapear Transactions para formato snake_case de banco', async () => {
      const tx = TransactionsMap.toDomain(rawDb);
      const persistence = await TransactionsMap.toPersistence(tx);
      expect(persistence.id).toBe('tx-uuid');
      expect(persistence.payment_method).toBe('envelope.transaction.payment_method.Pix');
      expect(persistence.envelope_id).toBeDefined();
      expect(persistence.credit_card_id).toBeNull();
      expect(persistence.debt_id).toBeNull();
    });
  });

  describe('toAnalyticsEnvelopesByYear()', () => {
    it('deve retornar array de 12 meses com valores zerados para meses ausentes', () => {
      const data = [
        { month: 1, amount: 500 },
        { month: 3, amount: 1200 },
      ];
      const result = TransactionsMap.toAnalyticsEnvelopesByYear(data);
      expect(result).toHaveLength(12);
      expect(result[0]).toBe(500);
      expect(result[1]).toBe(0);
      expect(result[2]).toBe(1200);
    });
  });
});
