import { describe, expect, test } from '@jest/globals';
import { User } from './user'
import { UserName } from './userName';
import { UserPassword } from './userPassword';
import { UserEmail } from './userEmail';


describe('User', () => {
  test('should give error: Text is not at least 2 chars', () => {
    const userNameOrError = UserName.create({ name: 't' });
    expect(userNameOrError.getErrorValue()).toBe('Text is not at least 2 chars.');
  });
})