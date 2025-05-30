import { Email } from "./Email";
import { Password } from "./Password";
import { JWTToken, RefreshToken } from "./JWT";
import { Guard } from "../../../../shared/core/Guard";
import { Result } from "../../../../shared/core/Result";
import { Id } from "../../../../shared/domain/Id";
import { Name } from "../../../../shared/domain/Name";
import { AggregateRoot } from "../../../../shared/domain/AggregateRoot";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";
import { UserCreated } from "./events/userCreated";
import { DomainEvents } from "../../../../shared/domain/events/DomainEvents";

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

  get userId (): Id {
    return Id.create(this._id)
      .getValue();
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

  private constructor (props: UserProps, id?: UniqueEntityID) {
    super(props, id)
  }
  public static create(props: UserProps, id?: UniqueEntityID): Result<User> {

    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.name, argumentName: "name" },
      { argument: props.email, argumentName: "email" },
    ]);

    if (guardResult.isFailure) {
      return Result.fail<User>('User :' + guardResult.getErrorValue());
    }

    const isNewUser = !!id === false;
    const user = new User(
      {
        ...props,
        isDeleted: props.isDeleted ?? false,
        isEmailVerified: props.isEmailVerified ?? false,
        isAdminUser: props.isAdminUser ?? false,
      },
      id
    );


    if (isNewUser) {
      user.addDomainEvent(new UserCreated(user));
    }

    
    return Result.ok<User>(user);
  }
}
