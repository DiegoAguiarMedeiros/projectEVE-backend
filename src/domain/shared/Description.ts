import { Guard } from "./core/Guard";
import { Result } from "./core/Result";
import { ValueObject } from "./ValueObject";



interface DescriptionProps {
  description: string;
}

export class Description extends ValueObject<DescriptionProps> {
  public static maxLength: number = 30;
  public static minLength: number = 2;

  get value(): string {
    return this.props.description;
  }

  private constructor(props: DescriptionProps) {
    super(props);
  }

  public static create(props: DescriptionProps): Result<Description> {
    const descriptionResult = Guard.againstNullOrUndefined(props.description, 'Description');
    if (descriptionResult.isFailure) {
      return Result.fail<Description>('Description: ' + descriptionResult.getErrorValue())
    }

    const minLengthResult = Guard.againstAtLeast(this.minLength, props.description);
    if (minLengthResult.isFailure) {
      return Result.fail<Description>('Description: ' + minLengthResult.getErrorValue())
    }

    const maxLengthResult = Guard.againstAtMost(this.maxLength, props.description);
    if (maxLengthResult.isFailure) {
      return Result.fail<Description>('Description: ' + maxLengthResult.getErrorValue())
    }

    return Result.ok<Description>(new Description(props));
  }
}