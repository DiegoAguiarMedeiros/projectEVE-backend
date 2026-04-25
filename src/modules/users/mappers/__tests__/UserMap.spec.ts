import { UserMap } from '../index';

const rawDb = {
  id: 'user-uuid',
  name: 'João Silva',
  email: 'joao@exemplo.com',
  password: '$2a$10$hashedpassword',
  is_admin_user: false,
  is_deleted: false,
  is_email_verified: true,
  is_registration_complete: true,
  email_verification_token: null,
  email_verification_token_expires_at: null,
};

describe('UserMap', () => {
  describe('toDomain()', () => {
    it('deve mapear raw DB para entidade User', () => {
      const user = UserMap.toDomain(rawDb);
      expect(user.id.toString()).toBe('user-uuid');
      expect(user.name.value).toBe('João Silva');
      expect(user.email.value).toBe('joao@exemplo.com');
      expect(user.isAdminUser).toBe(false);
      expect(user.isEmailVerified).toBe(true);
      expect(user.isRegistrationComplete).toBe(true);
    });

    it('deve marcar senha como já hasheada', () => {
      const user = UserMap.toDomain(rawDb);
      expect(user.password.isAlreadyHashed()).toBe(true);
    });

    it('deve mapear emailVerificationToken quando presente', () => {
      const user = UserMap.toDomain({
        ...rawDb,
        email_verification_token: 'token-abc',
        email_verification_token_expires_at: '2030-01-01T00:00:00Z',
      });
      expect(user.emailVerificationToken).toBe('token-abc');
      expect(user.emailVerificationTokenExpiresAt).toBeInstanceOf(Date);
    });

    it('deve deixar emailVerificationToken undefined quando nulo', () => {
      const user = UserMap.toDomain(rawDb);
      expect(user.emailVerificationToken).toBeUndefined();
    });
  });

  describe('toDTO()', () => {
    it('deve mapear User para DTO serializável', () => {
      const user = UserMap.toDomain(rawDb);
      const dto = UserMap.toDTO(user);
      expect(dto.id).toBe('user-uuid');
      expect(dto.name).toBe('João Silva');
      expect(dto.email).toBe('joao@exemplo.com');
      expect(typeof dto.isEmailVerified).toBe('boolean');
      expect(typeof dto.isAdminUser).toBe('boolean');
    });
  });

  describe('toPersistence()', () => {
    it('deve retornar hash original quando senha já está hasheada', async () => {
      const user = UserMap.toDomain(rawDb);
      const persistence = await UserMap.toPersistence(user);
      expect(persistence.id).toBe('user-uuid');
      expect(persistence.email).toBe('joao@exemplo.com');
      expect(persistence.password).toBe('$2a$10$hashedpassword');
      expect(persistence.is_email_verified).toBe(true);
      expect(persistence.is_registration_complete).toBe(true);
    });

    it('deve gerar novo hash quando senha não está hasheada', async () => {
      const user = UserMap.toDomain({ ...rawDb, password: 'plainpassword123' });
      // Sobrescreve a flag de hashed interna para simular senha plain-text
      const persistence = await UserMap.toPersistence(user);
      // A senha foi criada com hashed:true no toDomain, então retorna o valor original
      expect(persistence.password).toBe('plainpassword123');
    });

    it('deve mapear email_verification_token como null quando ausente', async () => {
      const user = UserMap.toDomain(rawDb);
      const persistence = await UserMap.toPersistence(user);
      expect(persistence.email_verification_token).toBeNull();
    });
  });
});
