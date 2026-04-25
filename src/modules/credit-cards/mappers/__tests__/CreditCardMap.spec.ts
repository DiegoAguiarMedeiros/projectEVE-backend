import { CreditCardMap } from '../index';

const rawDb = {
  id: 'cc-uuid',
  name: 'Nubank',
  flag: 'Visa',
  active: true,
  user_id: 'user-uuid',
};

describe('CreditCardMap', () => {
  describe('toDomain()', () => {
    it('deve mapear raw DB para entidade CreditCard', () => {
      const cc = CreditCardMap.toDomain(rawDb);
      expect(cc.id.toString()).toBe('cc-uuid');
      expect(cc.name.value).toBe('Nubank');
      expect(cc.flag.value).toBe('Visa');
      expect(cc.active).toBe(true);
    });

    it('deve lançar erro para nome inválido', () => {
      expect(() => CreditCardMap.toDomain({ ...rawDb, name: 'A' })).toThrow('Invalid use name');
    });
  });

  describe('toDTO()', () => {
    it('deve mapear CreditCard para DTO serializável', () => {
      const cc = CreditCardMap.toDomain(rawDb);
      const dto = CreditCardMap.toDTO(cc);
      expect(dto.id).toBe('cc-uuid');
      expect(dto.name).toBe('Nubank');
      expect(dto.flag).toBe('Visa');
      expect(dto.active).toBe(true);
      expect(typeof dto.userId).toBe('string');
    });
  });

  describe('toPersistence()', () => {
    it('deve mapear CreditCard para formato snake_case de banco', async () => {
      const cc = CreditCardMap.toDomain(rawDb);
      const persistence = await CreditCardMap.toPersistence(cc);
      expect(persistence.id).toBe('cc-uuid');
      expect(persistence.name).toBe('Nubank');
      expect(persistence.flag).toBe('Visa');
      expect(persistence.active).toBe(true);
      expect(persistence.user_id).toBeDefined();
    });
  });
});
