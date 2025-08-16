import { Guard } from "../../../shared/core/Guard";
import { Result } from "../../../shared/core/Result";
import { ValueObject } from "../../../shared/domain/ValueObject";



interface DayProps {
  day: number;
}

export class Day extends ValueObject<DayProps> {

  public static maxLength: number = 31;
  public static minLength: number = 1;
  get value(): number {
    return this.props.day;
  }

  private constructor(props: DayProps) {
    super(props);
  }

  public static create(props: DayProps): Result<Day> {
    const againstNullOrUndefined = Guard.againstNullOrUndefined(props.day, 'Day');
    if (againstNullOrUndefined.isFailure) {
      return Result.fail<Day>('Day: ' + againstNullOrUndefined.getErrorValue())
    }
    const inRange = Guard.inRange(props.day, this.minLength, this.maxLength, 'Day');
    if (inRange.isFailure) {
      return Result.fail<Day>('Day: ' + inRange.getErrorValue())
    }


    return Result.ok<Day>(new Day(props));
  }
}