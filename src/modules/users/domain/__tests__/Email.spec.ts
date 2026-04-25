import { Email } from '../Email';

describe('Email', () => {
  describe('create()', () => {
    it('deve criar com email válido', () => {
      const result = Email.create('usuario@exemplo.com');
      expect(result.isSuccess).toBe(true);
      expect(result.getValue().value).toBe('usuario@exemplo.com');
    });

    it('deve formatar o email para lowercase', () => {
      const result = Email.create('Usuario@Exemplo.COM');
      expect(result.isSuccess).toBe(true);
      expect(result.getValue().value).toBe('usuario@exemplo.com');
    });

    it('deve falhar com email que contém espaços', () => {
      const result = Email.create('  usuario@exemplo.com  ');
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar com null', () => {
      const result = Email.create(null as any);
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar com undefined', () => {
      const result = Email.create(undefined as any);
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar sem @ no email', () => {
      const result = Email.create('usuarioexemplo.com');
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar sem domínio no email', () => {
      const result = Email.create('usuario@');
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar com email completamente inválido', () => {
      const result = Email.create('nao-e-email');
      expect(result.isFailure).toBe(true);
    });
  });

  describe('equals()', () => {
    it('dois Email com mesmo valor devem ser iguais', () => {
      const a = Email.create('usuario@exemplo.com').getValue();
      const b = Email.create('usuario@exemplo.com').getValue();
      expect(a.equals(b)).toBe(true);
    });

    it('dois Email com valores diferentes não devem ser iguais', () => {
      const a = Email.create('a@exemplo.com').getValue();
      const b = Email.create('b@exemplo.com').getValue();
      expect(a.equals(b)).toBe(false);
    });
  });
});
