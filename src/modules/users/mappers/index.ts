import { UserDTO } from "../dtos";
import { Name } from "../../../shared/domain/Name";
import { Mapper } from "../../../shared/mappers/Mapper";
import { Email } from "../domain/Email";
import { Password } from "../domain/Password";
import { User } from "../domain/User";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";


export class UserMap implements Mapper<User> {
  public static toDTO(user: User): UserDTO {
    return {
      name: user.name.value,
      isEmailVerified: user.isEmailVerified,
      isAdminUser: user.isAdminUser,
      email: user.email.value,
      password: user.password.value,
      id: user.id.toString(),
      isRegistrationComplete: user.isRegistrationComplete,
    };
  }

  public static toDomain(raw: any): User {

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
        name: NameOrError.getValue(),
        isAdminUser: raw.is_admin_user,
        isDeleted: raw.is_deleted,
        isEmailVerified: raw.is_email_verified,
        isRegistrationComplete: raw.is_registration_complete,
        password: PasswordOrError.getValue(),
        email: EmailOrError.getValue(),
        emailVerificationToken: raw.email_verification_token ?? undefined,
        emailVerificationTokenExpiresAt: raw.email_verification_token_expires_at
          ? new Date(raw.email_verification_token_expires_at)
          : undefined,
      }, new UniqueEntityID(raw.id));

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
      id: user.id.toString(),
      email: user.email.value,
      is_email_verified: user.isEmailVerified,
      name: user.name.value,
      password: password,
      is_admin_user: user.isAdminUser,
      is_deleted: user.isDeleted,
      is_registration_complete: user.isRegistrationComplete,
      email_verification_token: user.emailVerificationToken ?? null,
      email_verification_token_expires_at: user.emailVerificationTokenExpiresAt ?? null,
    };
  }
}
