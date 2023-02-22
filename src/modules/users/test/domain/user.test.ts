import { describe, expect, test } from '@jest/globals';
import { User } from '../../domain/user'
import { UserName } from '../../domain/userName';
import { UserPassword } from '../../domain/userPassword';
import { UserEmail } from '../../domain/userEmail';


describe('User', () => {
  test('should create user', () => {

    const userNameOrError = UserName.create({ name: 'test' });
    const userPasswordOrError = UserPassword.create({ value: '1234', hashed: true });
    const userEmailOrError = UserEmail.create('test@test.com');

    const userOrError = User.create({
      username: userNameOrError.getValue(),
      password: userPasswordOrError.getValue(),
      email: userEmailOrError.getValue(),
    });

    expect(userOrError.isSuccess).toBe(true);

  });
})
describe('UserEmail', () => {
  test('should give error: Email address not valid', () => {
    const userEmailOrError = UserEmail.create('test@testcom');
    expect(userEmailOrError.getErrorValue()).toBe('Email address not valid');
  });
  test('should return UserEmail', () => {
    const userNameOrError = UserEmail.create('test@test.com');
    expect(userNameOrError.getValue().props.value).toBe('test@test.com');
  });
})
describe('UserName', () => {
  test('should give error: Text is not at least 2 chars', () => {
    const userNameOrError = UserName.create({ name: 't' });
    expect(userNameOrError.getErrorValue()).toBe('Text is not at least 2 chars.');
  });
  test('should return UserName', () => {
    const userNameOrError = UserName.create({ name: 'test' });
    expect(userNameOrError.getValue().props.name).toBe('test');
  });
  test('should give error: Text is greater than 15 chars', () => {
    const userNameOrError = UserName.create({ name: 'qwertyuiopasdfgs' });
    expect(userNameOrError.getErrorValue()).toBe('Text is greater than 15 chars.');
  });
})
describe('UserPassword', () => {
  test('should give error: Password doesnt meet criteria [8 chars min]', () => {
    const userPasswordOrError = UserPassword.create({ value: 'a' });
    expect(userPasswordOrError.getErrorValue()).toBe('Password doesnt meet criteria [8 chars min].');
  });
  test('should return UserPassword', () => {
    const userPasswordOrError = UserPassword.create({ value: '12345678' });
    expect(userPasswordOrError.getValue().props.value).toBe('12345678');
  });
  test('should return true on comparePassword', async () => {
    const userPasswordOrError = UserPassword.create({ value: '12345678' });
    expect(await userPasswordOrError.getValue().comparePassword('12345678')).toBe(true);
  });
  test('should return false on comparePassword', async () => {
    const userPasswordOrError = UserPassword.create({ value: '12345678' });
    expect(await userPasswordOrError.getValue().comparePassword('1234567')).toBe(false);
  });
  test('should return false on isAlreadyHashed', async () => {
    const userPasswordOrError = UserPassword.create({ value: '12345678' });
    expect(await userPasswordOrError.getValue().isAlreadyHashed()).toBe(false);
  });
  test('should return hash of password', async () => {
    const userPasswordOrError = UserPassword.create({ value: '12345678' });
    expect(await userPasswordOrError.getValue().getHashedValue()).toMatch(/^\$2[ayb]\$.{56}$/);
  });
})