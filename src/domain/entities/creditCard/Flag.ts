
import { Guard } from "../../shared/core/Guard";
import { Result } from "../../shared/core/Result";
import { ValueObject } from "../../shared/ValueObject";
import { allFlags, Flags } from "./Flags";


interface FlagProps {
  flag: Flags
}

export class Flag extends ValueObject<FlagProps> {
  public static maxLength: number = 30;
  public static minLength: number = 2;

  get value(): Flags {
    return this.props.flag;
  }

  private constructor(props: FlagProps) {
    super(props);
  }

  public static create(props: FlagProps): Result<Flag> {
    const flagIsOneOfResult = Guard.isOneOf(props.flag, allFlags, 'name');
    if (flagIsOneOfResult.isFailure) {
      return Result.fail<Flag>('Flag: ' + flagIsOneOfResult.getErrorValue())
    }
    const flagResult = Guard.againstNullOrUndefined(props.flag, 'name');
    if (flagResult.isFailure) {
      return Result.fail<Flag>('Flag: ' + flagResult.getErrorValue())
    }

    const minLengthResult = Guard.againstAtLeast(this.minLength, props.flag);
    if (minLengthResult.isFailure) {
      return Result.fail<Flag>('Flag: ' + minLengthResult.getErrorValue())
    }

    const maxLengthResult = Guard.againstAtMost(this.maxLength, props.flag);
    if (maxLengthResult.isFailure) {
      return Result.fail<Flag>('Flag: ' + maxLengthResult.getErrorValue())
    }

    return Result.ok<Flag>(new Flag(props));
  }
}