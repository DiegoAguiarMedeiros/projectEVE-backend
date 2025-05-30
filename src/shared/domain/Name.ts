import { Guard } from "../core/Guard";
import { Result } from "../core/Result";
import { ValueObject } from "./ValueObject";


interface NameProps {
  name: string;
}

export class Name extends ValueObject<NameProps> {
  public static maxLength: number = 30;
  public static minLength: number = 2;

  get value(): string {
    return this.props.name;
  }

  private constructor(props: NameProps) {
    super(props);
  }

  public static create(props: NameProps): Result<Name> {
    const nameResult = Guard.againstNullOrUndefined(props.name, 'name');
    if (nameResult.isFailure) {
      return Result.fail<Name>('Name: ' + nameResult.getErrorValue())
    }

    const minLengthResult = Guard.againstAtLeast(this.minLength, props.name);
    if (minLengthResult.isFailure) {
      return Result.fail<Name>('Name: ' + minLengthResult.getErrorValue())
    }

    const maxLengthResult = Guard.againstAtMost(this.maxLength, props.name);
    if (maxLengthResult.isFailure) {
      return Result.fail<Name>('Name: ' + maxLengthResult.getErrorValue())
    }

    return Result.ok<Name>(new Name(props));
  }
}