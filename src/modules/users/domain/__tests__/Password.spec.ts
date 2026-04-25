import { Password } from '../Password';

describe('Password', () => {
  describe('create()', () => {
    it('deve criar com senha válida (8+ chars)', () => {
      const result = Password.create({ value: 'minhasenha123' });
      expect(result.isSuccess).toBe(true);
      expect(result.getValue().value).toBe('minhasenha123');
    });

    it('deve criar com senha no limite mínimo (8 chars)', () => {
      const result = Password.create({ value: '12345678' });
      expect(result.isSuccess).toBe(true);
    });

    it('deve criar com senha já hasheada (ignora validação de tamanho)', () => {
      const result = Password.create({ value: '$2a$10$abc', hashed: true });
      expect(result.isSuccess).toBe(true);
      expect(result.getValue().isAlreadyHashed()).toBe(true);
    });

    it('deve falhar com null', () => {
      const result = Password.create({ value: null as any });
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar com undefined', () => {
      const result = Password.create({ value: undefined as any });
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar com senha muito curta (7 chars)', () => {
      const result = Password.create({ value: '1234567' });
      expect(result.isFailure).toBe(true);
    });
  });

  describe('isAlreadyHashed()', () => {
    it('deve retornar false para senha não hasheada', () => {
      const password = Password.create({ value: 'minhasenha123' }).getValue();
      expect(password.isAlreadyHashed()).toBe(false);
    });

    it('deve retornar true para senha hasheada', () => {
      const password = Password.create({ value: '$2a$10$hash', hashed: true }).getValue();
      expect(password.isAlreadyHashed()).toBe(true);
    });
  });

  describe('comparePassword()', () => {
    it('deve comparar senha plain-text corretamente', async () => {
      const password = Password.create({ value: 'minhasenha123' }).getValue();
      expect(await password.comparePassword('minhasenha123')).toBe(true);
      expect(await password.comparePassword('outrasenha')).toBe(false);
    });

    it('deve comparar senha hasheada via bcrypt', async () => {
      const plainText = 'minhasenha123';
      const hashed = await Password.create({ value: plainText }).getValue().getHashedValue();
      const password = Password.create({ value: hashed, hashed: true }).getValue();
      expect(await password.comparePassword(plainText)).toBe(true);
      expect(await password.comparePassword('senhaerrada')).toBe(false);
    });
  });

  describe('getHashedValue()', () => {
    it('deve retornar hash bcrypt para senha plain-text', async () => {
      const password = Password.create({ value: 'minhasenha123' }).getValue();
      const hashed = await password.getHashedValue();
      expect(hashed).not.toBe('minhasenha123');
      expect(hashed.startsWith('$2')).toBe(true);
    });

    it('deve retornar o valor original quando já hasheado', async () => {
      const hashValue = '$2a$10$examplehashvalue';
      const password = Password.create({ value: hashValue, hashed: true }).getValue();
      const result = await password.getHashedValue();
      expect(result).toBe(hashValue);
    });
  });
});
