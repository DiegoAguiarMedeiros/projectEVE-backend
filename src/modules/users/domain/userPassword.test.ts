import { describe, expect, test } from '@jest/globals';
import { UserPassword } from './userPassword';


describe('User', () => {
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
})