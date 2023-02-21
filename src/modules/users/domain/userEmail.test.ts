import { describe, expect, test } from '@jest/globals';
import { User } from './user'
import { UserName } from './userName';
import { UserPassword } from './userPassword';
import { UserEmail } from './userEmail';


describe('User', () => {
  test('should give error: Email address not valid', () => {
    const userEmailOrError = UserEmail.create('test@testcom');
    expect(userEmailOrError.getErrorValue()).toBe('Email address not valid');
  });
})