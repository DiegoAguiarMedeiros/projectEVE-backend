import { Email } from "./email";
import { Name } from "./name";
import { Id } from "./Id";
import { UserCreated } from "./events/userCreated";
import { Password } from "./password";
import { JWTToken, RefreshToken } from "./jwt";
import { UserLoggedIn } from "./events/userLoggedIn";
import { UserDeleted } from "./events/userDeleted";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Result } from "../../../shared/core/Result";
import { Guard } from "../../../shared/core/Guard";
import { AggregateRoot } from "../../../shared/domain/AggregateRoot";

interface UserProps {
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

export class User extends AggregateRoot<UserProps> {
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
    this.addDomainEvent(new UserLoggedIn(this));
    this.props.accessToken = token;
    this.props.refreshToken = refreshToken;
    this.props.lastLogin = new Date();
  }

  public delete(): void {
    if (!this.props.isDeleted) {
      this.addDomainEvent(new UserDeleted(this));
      this.props.isDeleted = true;
    }
  }

  private constructor(props: UserProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: UserProps, id?: UniqueEntityID): Result<User> {

    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.name, argumentName: "name" },
      { argument: props.email, argumentName: "email" },
    ]);

    if (guardResult.isFailure) {
      return Result.fail<User>(guardResult.getErrorValue());
    }

    const isNewUser = !!id === false;
    const user = new User(
      {
        ...props,
        isDeleted: props.isDeleted ? props.isDeleted : false,
        isEmailVerified: props.isEmailVerified ? props.isEmailVerified : false,
        isAdminUser: props.isAdminUser ? props.isAdminUser : false,
      },
      id
    );

    if (isNewUser) {
      user.addDomainEvent(new UserCreated(user));
    }

    return Result.ok<User>(user);
  }
}
