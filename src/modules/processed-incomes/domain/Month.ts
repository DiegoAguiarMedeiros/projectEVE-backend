import { Guard } from "../../../shared/core/Guard";
import { Result } from "../../../shared/core/Result";
import { ValueObject } from "../../../shared/domain/ValueObject";



interface MonthProps {
  month: number;
}

export class Month extends ValueObject<MonthProps> {

  public static maxLength: number = 12;
  public static minLength: number = 1;
  get value(): number {
    return this.props.month;
  }

  private constructor(props: MonthProps) {
    super(props);
  }

  public static create(props: MonthProps): Result<Month> {
    const againstNullOrUndefined = Guard.againstNullOrUndefined(props.month, 'month');
    if (againstNullOrUndefined.isFailure) {
      return Result.fail<Month>('Month: ' + againstNullOrUndefined.getErrorValue())
    }
    const inRange = Guard.inRange(props.month, this.minLength, this.maxLength, 'month');
    if (inRange.isFailure) {
      return Result.fail<Month>('Month: ' + inRange.getErrorValue())
    }


    return Result.ok<Month>(new Month(props));
  }
}