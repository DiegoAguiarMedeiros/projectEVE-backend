import { Guard } from "../core/Guard";
import { Result } from "../core/Result";
import { ValueObject } from "./ValueObject";



interface ReferenceProps {
  reference: string
}

export class Reference extends ValueObject<ReferenceProps> {
  public static maxLength: number = 7;
  public static minLength: number = 7;

  get value(): string {
    return this.props.reference;
  }

  private constructor(props: ReferenceProps) {
    super(props);
  }

  public static create(props: ReferenceProps): Result<Reference> {
  const referenceResult = Guard.againstNullOrUndefined(props.reference, 'reference');
    if (referenceResult.isFailure) {
      return Result.fail<Reference>('Reference: ' + referenceResult.getErrorValue())
    }

    const minLengthResult = Guard.againstAtLeast(this.minLength, props.reference);
    if (minLengthResult.isFailure) {
      return Result.fail<Reference>('Reference: ' + minLengthResult.getErrorValue())
    }

    const maxLengthResult = Guard.againstAtMost(this.maxLength, props.reference);
    if (maxLengthResult.isFailure) {
      return Result.fail<Reference>('Reference: ' + maxLengthResult.getErrorValue())
    }


    return Result.ok<Reference>(new Reference(props));
  }
}