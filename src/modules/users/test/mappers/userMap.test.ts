import { describe, expect, test } from '@jest/globals';
import { UserMap } from '../../mappers/userMap';
import { User } from '../../domain/user';
import { UserEmail } from '../../domain/userEmail';
import { UserName } from '../../domain/userName';
import { UserPassword } from '../../domain/userPassword';
import { UserDTO } from '../../dtos/userDTO';

describe('UserMap', () => {
    test('should User maper to UserDTO', () => {

        const userNameOrError = UserName.create({ name: 'test' });
        const userPasswordOrError = UserPassword.create({ value: '1234', hashed: true });
        const userEmailOrError = UserEmail.create('test@test.com');

        const userOrError = User.create({
            username: userNameOrError.getValue(),
            password: userPasswordOrError.getValue(),
            email: userEmailOrError.getValue(),
        });

        const userDto: UserDTO = UserMap.toDTO(userOrError.getValue());

        expect(userDto).toStrictEqual({
            username: 'test',
            isEmailVerified: false,
            isAdminUser: false,
            isDeleted: false
        });

    });
})