import { describe, expect, test } from '@jest/globals';
import { User } from './user'
import { UserName } from './userName';
import { UserPassword } from './userPassword';
import { UserEmail } from './userEmail';


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