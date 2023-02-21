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
})