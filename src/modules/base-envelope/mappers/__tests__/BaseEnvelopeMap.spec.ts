import { BaseEnvelopeMap } from '../index';

const rawDb = {
  id: 'be-uuid',
  name: 'Alimentação',
  color: '#ff5733',
  order: 1,
};

describe('BaseEnvelopeMap', () => {
  describe('toDomain()', () => {
    it('deve mapear raw DB para entidade BaseEnvelope', () => {
      const be = BaseEnvelopeMap.toDomain(rawDb);
      expect(be.id.toString()).toBe('be-uuid');
      expect(be.name.value).toBe('Alimentação');
      expect(be.color.value).toBe('#ff5733');
      expect(be.order.value).toBe(1);
    });

    it('deve lançar erro para nome inválido', () => {
      expect(() => BaseEnvelopeMap.toDomain({ ...rawDb, name: 'A' })).toThrow('Invalid use name');
    });

    it('deve lançar erro para cor inválida', () => {
      expect(() => BaseEnvelopeMap.toDomain({ ...rawDb, color: 'invalida' })).toThrow('Invalid use color');
    });
  });

  describe('toDTO()', () => {
    it('deve mapear BaseEnvelope para DTO serializável', () => {
      const be = BaseEnvelopeMap.toDomain(rawDb);
      const dto = BaseEnvelopeMap.toDTO(be);
      expect(dto.id).toBe('be-uuid');
      expect(dto.name).toBe('Alimentação');
      expect(dto.color).toBe('#ff5733');
      expect(dto.order).toBe(1);
    });
  });

  describe('toPersistence()', () => {
    it('deve mapear BaseEnvelope para formato de banco', async () => {
      const be = BaseEnvelopeMap.toDomain(rawDb);
      const persistence = await BaseEnvelopeMap.toPersistence(be);
      expect(persistence.id).toBe('be-uuid');
      expect(persistence.name).toBe('Alimentação');
      expect(persistence.color).toBe('#ff5733');
      expect(persistence.order).toBe(1);
    });
  });
});
