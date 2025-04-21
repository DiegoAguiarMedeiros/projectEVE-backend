
import { Guard } from "../../shared/core/Guard";
import { Result } from "../../shared/core/Result";
import { ValueObject } from "../../shared/ValueObject";


interface PercentageProps {
  percentage: number
}

export class Percentage extends ValueObject<PercentageProps> {
  public static maxLength: number = 100;
  public static minLength: number = 0;

  get value(): number {
    return this.props.percentage;
  }

  private constructor(props: PercentageProps) {
    super(props);
  }

  public static create(props: PercentageProps): Result<Percentage> {
    const flagResult = Guard.againstNullOrUndefined(props.percentage, 'name');
    if (flagResult.isFailure) {
      return Result.fail<Percentage>('Percentage: ' + flagResult.getErrorValue())
    }


    const minLengthResult = Guard.inRange(props.percentage,this.minLength,this.maxLength, 'name');
    if (minLengthResult.isFailure) {
      return Result.fail<Percentage>('Percentage: ' + minLengthResult.getErrorValue())
    }


    return Result.ok<Percentage>(new Percentage(props));
  }
}