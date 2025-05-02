import { UserDTO } from "../../../domain/dto/user";
import { Email } from "../../../domain/entities/user/Email";
import { Password } from "../../../domain/entities/user/Password";
import { User } from "../../../domain/entities/user/User";
import { Id } from "../../../domain/shared/Id";
import { Name } from "../../../domain/shared/Name";
import { Mapper } from "../Mapper";


export class UserMap implements Mapper<User> {
  public static toDTO(user: User): UserDTO {
    return {
      name: user.name.value,
      isEmailVerified: user.isEmailVerified,
      isAdminUser: user.isAdminUser,
      id: user.id.value,
      email: user.email.value,
      password: user.password.value
    };
  }

  public static toDomain(raw: any): User {
    const IdOrError = Id.create(raw.id);
    IdOrError.isFailure ? console.error(IdOrError.getErrorValue()) : '';

    const NameOrError = Name.create({ name: raw.name });
    NameOrError.isFailure ? console.error(NameOrError.getErrorValue()) : '';

    const PasswordOrError = Password.create({
      value: raw.password,
      hashed: true,
    });
    PasswordOrError.isFailure ? console.error(PasswordOrError.getErrorValue()) : '';

    const EmailOrError = Email.create(raw.email);
    EmailOrError.isFailure ? console.error(EmailOrError.getErrorValue()) : '';


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

    userOrError.isFailure ? console.error(userOrError.getErrorValue()) : '';

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
