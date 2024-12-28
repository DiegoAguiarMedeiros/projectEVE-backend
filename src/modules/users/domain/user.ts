import { Email } from "./email";
import { Name } from "./name";
import { Password } from "./password";
import { JWTToken, RefreshToken } from "./jwt";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Result } from "../../../shared/core/Result";
import { Guard } from "../../../shared/core/Guard";
import { Id } from "../../../shared/domain/Id";

interface UserProps {
  id: Id,
  email: Email;
  name: Name;
  password: Password;
  isEmailVerified?: boolean;
  isAdminUser?: boolean;
  accessToken?: JWTToken;
  refreshToken?: RefreshToken;
  isDeleted?: boolean;
  lastLogin?: Date;
}

export class User {
  private props: UserProps;

  get id(): Id {
    return this.props.id;
  }
  get email(): Email {
    return this.props.email;
  }

  get name(): Name {
    return this.props.name;
  }

  get password(): Password {
    return this.props.password;
  }

  get accessToken(): string {
    return this.props.accessToken ?? '';
  }

  get isDeleted(): boolean {
    return this.props.isDeleted ?? false;
  }

  get isEmailVerified(): boolean {
    return this.props.isEmailVerified ?? false;
  }

  get isAdminUser(): boolean {
    return this.props.isAdminUser ?? false;
  }

  get lastLogin(): Date {
    return this.props.lastLogin ?? new Date('1900-01-01T00:00:00Z');
  }

  get refreshToken(): RefreshToken {
    return this.props.refreshToken ?? '';
  }

  public isLoggedIn(): boolean {
    return !!this.props.accessToken && !!this.props.refreshToken;
  }

  public setAccessToken(token: JWTToken, refreshToken: RefreshToken): void {
    this.props.accessToken = token;
    this.props.refreshToken = refreshToken;
    this.props.lastLogin = new Date();
  }

  public delete(): void {
    if (!this.props.isDeleted) {
      this.props.isDeleted = true;
    }
  }

  private constructor(props: UserProps) {
    this.props = props;
  }

  public static create(props: UserProps): Result<User> {

    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.name, argumentName: "name" },
      { argument: props.email, argumentName: "email" },
    ]);

    if (guardResult.isFailure) {
      return Result.fail<User>('User :' + guardResult.getErrorValue());
    }

    const user = new User(
      {
        ...props,
        isDeleted: props.isDeleted ?? false,
        isEmailVerified: props.isEmailVerified ?? false,
        isAdminUser: props.isAdminUser ?? false,
      }
    );

    return Result.ok<User>(user);
  }
}
