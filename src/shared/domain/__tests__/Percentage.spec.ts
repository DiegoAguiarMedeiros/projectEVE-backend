import { Percentage } from '../Percentage';

describe('Percentage', () => {
  describe('create()', () => {
    it('deve criar com valor válido (50)', () => {
      const result = Percentage.create({ percentage: 50 });
      expect(result.isSuccess).toBe(true);
      expect(result.getValue().value).toBe(50);
    });

    it('deve criar com valor mínimo (0)', () => {
      const result = Percentage.create({ percentage: 0 });
      expect(result.isSuccess).toBe(true);
      expect(result.getValue().value).toBe(0);
    });

    it('deve criar com valor máximo (100)', () => {
      const result = Percentage.create({ percentage: 100 });
      expect(result.isSuccess).toBe(true);
      expect(result.getValue().value).toBe(100);
    });

    it('deve criar com valor decimal (33.5)', () => {
      const result = Percentage.create({ percentage: 33.5 });
      expect(result.isSuccess).toBe(true);
      expect(result.getValue().value).toBe(33.5);
    });

    it('deve falhar com null', () => {
      const result = Percentage.create({ percentage: null as any });
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar com undefined', () => {
      const result = Percentage.create({ percentage: undefined as any });
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar com valor menor que 0 (-1)', () => {
      const result = Percentage.create({ percentage: -1 });
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar com valor maior que 100 (101)', () => {
      const result = Percentage.create({ percentage: 101 });
      expect(result.isFailure).toBe(true);
    });
  });

  describe('equals()', () => {
    it('dois Percentage com mesmo valor devem ser iguais', () => {
      const a = Percentage.create({ percentage: 50 }).getValue();
      const b = Percentage.create({ percentage: 50 }).getValue();
      expect(a.equals(b)).toBe(true);
    });

    it('dois Percentage com valores diferentes não devem ser iguais', () => {
      const a = Percentage.create({ percentage: 50 }).getValue();
      const b = Percentage.create({ percentage: 75 }).getValue();
      expect(a.equals(b)).toBe(false);
    });
  });
});
