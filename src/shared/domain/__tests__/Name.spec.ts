import { Name } from '../Name';

describe('Name', () => {
  describe('create()', () => {
    it('deve criar com nome válido', () => {
      const result = Name.create({ name: 'Salário' });
      expect(result.isSuccess).toBe(true);
      expect(result.getValue().value).toBe('Salário');
    });

    it('deve criar com nome no limite mínimo (2 chars)', () => {
      const result = Name.create({ name: 'AB' });
      expect(result.isSuccess).toBe(true);
    });

    it('deve criar com nome no limite máximo (30 chars)', () => {
      const result = Name.create({ name: 'A'.repeat(30) });
      expect(result.isSuccess).toBe(true);
    });

    it('deve falhar com null', () => {
      const result = Name.create({ name: null as any });
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar com undefined', () => {
      const result = Name.create({ name: undefined as any });
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar com nome muito curto (1 char)', () => {
      const result = Name.create({ name: 'A' });
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar com nome muito longo (31 chars)', () => {
      const result = Name.create({ name: 'A'.repeat(31) });
      expect(result.isFailure).toBe(true);
    });
  });

  describe('equals()', () => {
    it('dois Name com mesmo valor devem ser iguais', () => {
      const a = Name.create({ name: 'Salário' }).getValue();
      const b = Name.create({ name: 'Salário' }).getValue();
      expect(a.equals(b)).toBe(true);
    });

    it('dois Name com valores diferentes não devem ser iguais', () => {
      const a = Name.create({ name: 'Salário' }).getValue();
      const b = Name.create({ name: 'Aluguel' }).getValue();
      expect(a.equals(b)).toBe(false);
    });
  });
});
