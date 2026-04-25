import { Color } from '../Color';

describe('Color', () => {
  describe('create()', () => {
    it('deve criar com cor hex válida de 7 chars (#ffffff)', () => {
      const result = Color.create({ color: '#ffffff' });
      expect(result.isSuccess).toBe(true);
      expect(result.getValue().value).toBe('#ffffff');
    });

    it('deve criar com outra cor hex válida (#1a2b3c)', () => {
      const result = Color.create({ color: '#1a2b3c' });
      expect(result.isSuccess).toBe(true);
    });

    it('deve falhar com null', () => {
      const result = Color.create({ color: null as any });
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar com undefined', () => {
      const result = Color.create({ color: undefined as any });
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar com string muito curta (menos de 7 chars)', () => {
      const result = Color.create({ color: '#fff' });
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar com string muito longa (mais de 7 chars)', () => {
      const result = Color.create({ color: '#ffffffff' });
      expect(result.isFailure).toBe(true);
    });
  });

  describe('equals()', () => {
    it('dois Color com mesmo valor devem ser iguais', () => {
      const a = Color.create({ color: '#ffffff' }).getValue();
      const b = Color.create({ color: '#ffffff' }).getValue();
      expect(a.equals(b)).toBe(true);
    });

    it('dois Color com valores diferentes não devem ser iguais', () => {
      const a = Color.create({ color: '#ffffff' }).getValue();
      const b = Color.create({ color: '#000000' }).getValue();
      expect(a.equals(b)).toBe(false);
    });
  });
});
