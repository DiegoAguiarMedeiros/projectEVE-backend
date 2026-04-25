import { EnvelopesMap } from '../index';

const rawDb = {
  id: 'env-uuid',
  name: 'Alimentação',
  color: '#ff5733',
  order: 1,
  percentage: 30,
  user_id: 'user-uuid',
  EnvelopesAmounts: [],
};

const rawDbWithAmount = {
  ...rawDb,
  EnvelopesAmounts: [{ amount: 1500 }],
};

describe('EnvelopesMap', () => {
  describe('toDomain()', () => {
    it('deve mapear raw DB para entidade Envelopes', () => {
      const envelope = EnvelopesMap.toDomain(rawDb);
      expect(envelope.id.toString()).toBe('env-uuid');
      expect(envelope.name.value).toBe('Alimentação');
      expect(envelope.color.value).toBe('#ff5733');
      expect(envelope.order.value).toBe(1);
      expect(envelope.percentage.value).toBe(30);
    });

    it('deve mapear amount quando EnvelopesAmounts existe', () => {
      const envelope = EnvelopesMap.toDomain(rawDbWithAmount);
      expect(envelope.amount?.value).toBe(1500);
    });

    it('deve deixar amount undefined quando EnvelopesAmounts está vazio', () => {
      const envelope = EnvelopesMap.toDomain(rawDb);
      expect(envelope.amount).toBeUndefined();
    });

    it('deve lançar erro para nome inválido', () => {
      expect(() => EnvelopesMap.toDomain({ ...rawDb, name: 'A' })).toThrow('Invalid use name');
    });

    it('deve lançar erro para cor inválida (comprimento errado)', () => {
      expect(() => EnvelopesMap.toDomain({ ...rawDb, color: '#fff' })).toThrow('Invalid use color');
    });
  });

  describe('toDTO()', () => {
    it('deve mapear Envelopes para DTO serializável', () => {
      const envelope = EnvelopesMap.toDomain(rawDbWithAmount);
      const dto = EnvelopesMap.toDTO(envelope);
      expect(dto.id).toBe('env-uuid');
      expect(dto.name).toBe('Alimentação');
      expect(dto.color).toBe('#ff5733');
      expect(dto.amount).toBe(1500);
      expect(dto.percentage).toBe(30);
    });

    it('deve mapear amount como undefined quando não existir', () => {
      const envelope = EnvelopesMap.toDomain(rawDb);
      const dto = EnvelopesMap.toDTO(envelope);
      expect(dto.amount).toBeUndefined();
    });
  });

  describe('toPersistence()', () => {
    it('deve mapear Envelopes para formato snake_case de banco', async () => {
      const envelope = EnvelopesMap.toDomain(rawDb);
      const persistence = await EnvelopesMap.toPersistence(envelope);
      expect(persistence.id).toBe('env-uuid');
      expect(persistence.name).toBe('Alimentação');
      expect(persistence.color).toBe('#ff5733');
      expect(persistence.order).toBe(1);
      expect(persistence.percentage).toBe(30);
      expect(persistence.user_id).toBeDefined();
    });
  });

  describe('toAnalyticsCurrentEnvelopesDTO()', () => {
    it('deve filtrar itens sem saldo e sem renda e calcular usedPercent baseado em gastos reais', () => {
      const raw = [
        { name: 'Alimentação', color: '#ff5733', envelope_amount: '700', total_amount_no_realloc: '1000', total_debit_no_realloc: '300' },
        { name: 'Lazer', color: '#000000', envelope_amount: '0', total_amount_no_realloc: '0', total_debit_no_realloc: '0' },
      ];
      const dto = EnvelopesMap.toAnalyticsCurrentEnvelopesDTO(raw);
      expect(dto.labels!).toHaveLength(1);
      expect(dto.labels![0]).toBe('Alimentação');
      expect(dto.values![0]).toBe(700);
      expect(dto.subValues![0]).toBe(30);
    });

    it('não deve alterar usedPercent quando há realocação', () => {
      const raw = [
        // Envelope A: recebeu 1000, sem gastos, realocou 500 para fora (saldo: 500)
        { name: 'Envelope A', color: '#ff5733', envelope_amount: '500', total_amount_no_realloc: '1000', total_debit_no_realloc: '0' },
        // Envelope B: recebeu 1000, sem gastos, recebeu 500 de realocação (saldo: 1500)
        { name: 'Envelope B', color: '#000000', envelope_amount: '1500', total_amount_no_realloc: '1000', total_debit_no_realloc: '0' },
      ];
      const dto = EnvelopesMap.toAnalyticsCurrentEnvelopesDTO(raw);
      expect(dto.values![0]).toBe(500);
      expect(dto.values![1]).toBe(1500);
      expect(dto.subValues![0]).toBe(0);
      expect(dto.subValues![1]).toBe(0);
    });
  });
});
