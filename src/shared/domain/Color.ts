
import { Guard } from "../core/Guard";
import { Result } from "../core/Result";
import { ValueObject } from "./ValueObject";


interface ColorProps {
  color: string
}

export class Color extends ValueObject<ColorProps> {
  public static maxLength: number = 7;
  public static minLength: number = 7;

  get value(): string {
    return this.props.color;
  }

  private constructor(props: ColorProps) {
    super(props);
  }

  public static create(props: ColorProps): Result<Color> {
    
    const flagResult = Guard.againstNullOrUndefined(props.color, 'name');
    if (flagResult.isFailure) {
      return Result.fail<Color>('Color: ' + flagResult.getErrorValue())
    }


    const minLengthResult = Guard.againstAtLeast(this.minLength, props.color);
    if (minLengthResult.isFailure) {
      return Result.fail<Color>('Color: ' + minLengthResult.getErrorValue())
    }

    const maxLengthResult = Guard.againstAtMost(this.maxLength, props.color);
    if (maxLengthResult.isFailure) {
      return Result.fail<Color>('Color: ' + maxLengthResult.getErrorValue())
    }

    return Result.ok<Color>(new Color(props));
  }
}