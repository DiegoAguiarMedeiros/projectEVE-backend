import { Mapper } from "../../../shared/infra/Mapper";
import { User } from "../domain/user";
import { UserDTO } from "../dtos/userDTO";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Name } from "../domain/name";
import { Password } from "../domain/password";
import { Email } from "../domain/email";
import { Id } from "../../../shared/domain/Id";

export class UserMap implements Mapper<User> {
  public static toDTO(user: User): UserDTO {
    return {
      name: user.name.value,
      isEmailVerified: user.isEmailVerified,
      isAdminUser: user.isAdminUser,
      isDeleted: user.isDeleted,
    };
  }

  public static toDomain(raw: any): User {
    const IdOrError = Id.create(raw.id);
    if (IdOrError.isFailure) {
      throw new Error('Invalid id');
    }
    const NameOrError = Name.create({ name: raw.name });
    if (NameOrError.isFailure) {
      throw new Error('Invalid use name');
    }
    const PasswordOrError = Password.create({
      value: raw.password,
      hashed: true,
    });
    if (PasswordOrError.isFailure) {
      throw new Error('Invalid user password');
    }
    const EmailOrError = Email.create(raw.email);
    if (EmailOrError.isFailure) {
      throw new Error('Invalid user email');
    }


    const userOrError = User.create(
      {
        id: IdOrError.getValue(),
        name: NameOrError.getValue(),
        isAdminUser: raw.is_admin_user,
        isDeleted: raw.is_deleted,
        isEmailVerified: raw.is_email_verified,
        password: PasswordOrError.getValue(),
        email: EmailOrError.getValue(),
      }
    );

    if (userOrError.isFailure) {
      throw new Error('Failed to create user');
    }
    return userOrError.getValue();
  }

  public static async toPersistence(user: User): Promise<any> {
    let password: string = '';
    if (!!user.password === true) {
      if (user.password.isAlreadyHashed()) {
        password = user.password.value;
      } else {
        password = await user.password.getHashedValue();
      }
    }

    return {
      id: user.id.value,
      email: user.email.value,
      is_email_verified: user.isEmailVerified,
      name: user.name.value,
      password: password,
      is_admin_user: user.isAdminUser,
      is_deleted: user.isDeleted,
    };
  }
}
