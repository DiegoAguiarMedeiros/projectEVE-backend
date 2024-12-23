
import { Result } from "../../../shared/core/Result";
import { ValueObject } from "../../../shared/domain/ValueObject";
import { Guard } from "../../../shared/core/Guard";

interface NameProps {
  name: string;
}

export class Name extends ValueObject<NameProps> {
  public static maxLength: number = 15;
  public static minLength: number = 2;

  get value (): string {
    return this.props.name;
  }

  private constructor (props: NameProps) {
    super(props);
  }

  public static create (props: NameProps): Result<Name> {
    const nameResult = Guard.againstNullOrUndefined(props.name, 'name');
    if (nameResult.isFailure) {
      return Result.fail<Name>(nameResult.getErrorValue())
    }

    const minLengthResult = Guard.againstAtLeast(this.minLength, props.name);
    if (minLengthResult.isFailure) {
      return Result.fail<Name>(minLengthResult.getErrorValue())
    }

    const maxLengthResult = Guard.againstAtMost(this.maxLength, props.name);
    if (maxLengthResult.isFailure) {
      return Result.fail<Name>(maxLengthResult.getErrorValue())
    }

    return Result.ok<Name>(new Name(props));
  }
}