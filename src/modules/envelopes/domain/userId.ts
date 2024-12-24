
import { Result } from "../../../shared/core/Result";
import { ValueObject } from "../../../shared/domain/ValueObject";
import { Guard } from "../../../shared/core/Guard";

interface UserIdProps {
  userId: string;
}

export class UserId extends ValueObject<UserIdProps> {
  public static maxLength: number = 36;
  public static minLength: number = 36;

  get value(): string {
    return this.props.userId;
  }

  private constructor(props: UserIdProps) {
    super(props);
  }

  public static create(props: UserIdProps): Result<UserId> {
    const userIdResult = Guard.againstNullOrUndefined(props.userId, 'userId');
    if (userIdResult.isFailure) {
      return Result.fail<UserId>('UserId: ' + userIdResult.getErrorValue())
    }

    const minLengthResult = Guard.againstAtLeast(this.minLength, props.userId);
    if (minLengthResult.isFailure) {
      return Result.fail<UserId>('UserId: ' + minLengthResult.getErrorValue())
    }

    const maxLengthResult = Guard.againstAtMost(this.maxLength, props.userId);
    if (maxLengthResult.isFailure) {
      return Result.fail<UserId>('UserId: ' + maxLengthResult.getErrorValue())
    }

    return Result.ok<UserId>(new UserId(props));
  }
}