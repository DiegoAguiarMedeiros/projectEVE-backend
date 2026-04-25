import { User } from '../User';
import { Email } from '../Email';
import { Password } from '../Password';
import { Name } from '../../../../shared/domain/Name';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';

const makeValidProps = () => ({
  email: Email.create('usuario@exemplo.com').getValue(),
  name: Name.create({ name: 'João Silva' }).getValue(),
  password: Password.create({ value: 'senha12345' }).getValue(),
});

describe('User', () => {
  describe('create()', () => {
    it('deve criar User com props válidos', () => {
      const result = User.create(makeValidProps());
      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toBeInstanceOf(User);
    });

    it('deve preservar o id fornecido', () => {
      const id = new UniqueEntityID('user-uuid');
      const user = User.create(makeValidProps(), id).getValue();
      expect(user.id.toString()).toBe('user-uuid');
    });

    it('deve aplicar defaults corretamente', () => {
      const user = User.create(makeValidProps()).getValue();
      expect(user.isDeleted).toBe(false);
      expect(user.isEmailVerified).toBe(false);
      expect(user.isAdminUser).toBe(false);
      expect(user.isRegistrationComplete).toBe(false);
    });

    it('deve falhar quando name é null', () => {
      const result = User.create({ ...makeValidProps(), name: null as any });
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar quando email é null', () => {
      const result = User.create({ ...makeValidProps(), email: null as any });
      expect(result.isFailure).toBe(true);
    });

    it('deve adicionar evento UserCreated quando é novo usuário (sem id)', () => {
      const user = User.create(makeValidProps()).getValue();
      expect(user.domainEvents).toHaveLength(1);
    });

    it('não deve adicionar evento UserCreated quando id é fornecido', () => {
      const id = new UniqueEntityID('existing-id');
      const user = User.create(makeValidProps(), id).getValue();
      expect(user.domainEvents).toHaveLength(0);
    });
  });

  describe('isLoggedIn()', () => {
    it('deve retornar false quando não há tokens', () => {
      const user = User.create(makeValidProps()).getValue();
      expect(user.isLoggedIn()).toBe(false);
    });

    it('deve retornar true após setAccessToken()', () => {
      const user = User.create(makeValidProps()).getValue();
      user.setAccessToken('jwt-token', 'refresh-token');
      expect(user.isLoggedIn()).toBe(true);
    });
  });

  describe('delete()', () => {
    it('deve marcar isDeleted como true', () => {
      const user = User.create(makeValidProps()).getValue();
      user.delete();
      expect(user.isDeleted).toBe(true);
    });

    it('não deve alterar estado se já está deletado', () => {
      const user = User.create({ ...makeValidProps(), isDeleted: true }).getValue();
      user.delete();
      expect(user.isDeleted).toBe(true);
    });
  });

  describe('verifyEmail()', () => {
    it('deve marcar isEmailVerified como true e limpar token', () => {
      const user = User.create(makeValidProps()).getValue();
      user.setEmailVerificationToken('abc123', new Date('2030-01-01'));
      user.verifyEmail();
      expect(user.isEmailVerified).toBe(true);
      expect(user.emailVerificationToken).toBeUndefined();
    });
  });

  describe('completeRegistration()', () => {
    it('deve marcar isRegistrationComplete como true', () => {
      const user = User.create(makeValidProps()).getValue();
      user.completeRegistration();
      expect(user.isRegistrationComplete).toBe(true);
    });
  });

  describe('updateName()', () => {
    it('deve atualizar o nome do usuário', () => {
      const user = User.create(makeValidProps()).getValue();
      const newName = Name.create({ name: 'Maria Silva' }).getValue();
      user.updateName(newName);
      expect(user.name.value).toBe('Maria Silva');
    });
  });
});
