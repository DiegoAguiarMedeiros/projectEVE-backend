import { Description } from '../Description';

describe('Description', () => {
  describe('create()', () => {
    it('deve criar com descrição válida', () => {
      const result = Description.create({ description: 'Meta de viagem' });
      expect(result.isSuccess).toBe(true);
      expect(result.getValue().value).toBe('Meta de viagem');
    });

    it('deve criar com descrição no limite mínimo (2 chars)', () => {
      const result = Description.create({ description: 'AB' });
      expect(result.isSuccess).toBe(true);
    });

    it('deve criar com descrição no limite máximo (255 chars)', () => {
      const result = Description.create({ description: 'A'.repeat(255) });
      expect(result.isSuccess).toBe(true);
    });

    it('deve falhar com null', () => {
      const result = Description.create({ description: null as any });
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar com undefined', () => {
      const result = Description.create({ description: undefined as any });
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar com descrição muito curta (1 char)', () => {
      const result = Description.create({ description: 'A' });
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar com descrição muito longa (256 chars)', () => {
      const result = Description.create({ description: 'A'.repeat(256) });
      expect(result.isFailure).toBe(true);
    });
  });

  describe('equals()', () => {
    it('duas Description com mesmo valor devem ser iguais', () => {
      const a = Description.create({ description: 'Meta de viagem' }).getValue();
      const b = Description.create({ description: 'Meta de viagem' }).getValue();
      expect(a.equals(b)).toBe(true);
    });

    it('duas Description com valores diferentes não devem ser iguais', () => {
      const a = Description.create({ description: 'Meta de viagem' }).getValue();
      const b = Description.create({ description: 'Meta de carro' }).getValue();
      expect(a.equals(b)).toBe(false);
    });
  });
});
