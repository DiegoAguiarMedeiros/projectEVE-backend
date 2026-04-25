import { Balance } from '../Balance';

describe('Balance', () => {
  describe('create()', () => {
    it('deve criar com número positivo válido', () => {
      const result = Balance.create({ balance: 100.5 });
      expect(result.isSuccess).toBe(true);
      expect(result.getValue().value).toBe(100.5);
    });

    it('deve criar com zero', () => {
      const result = Balance.create({ balance: 0 });
      expect(result.isSuccess).toBe(true);
      expect(result.getValue().value).toBe(0);
    });

    it('deve converter string numérica', () => {
      const result = Balance.create({ balance: '50' as any });
      expect(result.isSuccess).toBe(true);
      expect(result.getValue().value).toBe(50);
    });

    it('deve falhar com null', () => {
      const result = Balance.create({ balance: null as any });
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar com undefined', () => {
      const result = Balance.create({ balance: undefined as any });
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar com valor negativo', () => {
      const result = Balance.create({ balance: -1 });
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar com NaN', () => {
      const result = Balance.create({ balance: NaN });
      expect(result.isFailure).toBe(true);
    });
  });

  describe('equals()', () => {
    it('dois Balance com mesmo valor devem ser iguais', () => {
      const a = Balance.create({ balance: 100 }).getValue();
      const b = Balance.create({ balance: 100 }).getValue();
      expect(a.equals(b)).toBe(true);
    });

    it('dois Balance com valores diferentes não devem ser iguais', () => {
      const a = Balance.create({ balance: 100 }).getValue();
      const b = Balance.create({ balance: 200 }).getValue();
      expect(a.equals(b)).toBe(false);
    });

    it('deve retornar false ao comparar com undefined', () => {
      const a = Balance.create({ balance: 100 }).getValue();
      expect(a.equals(undefined)).toBe(false);
    });
  });
});
