import { Guard } from "../../../shared/core/Guard";
import { Result } from "../../../shared/core/Result";
import { ValueObject } from "../../../shared/domain/ValueObject";



interface YearProps {
  year: number;
}

export class Year extends ValueObject<YearProps> {
  public static minLength: number = 2000;
  get value(): number {
    return this.props.year;
  }

  private constructor(props: YearProps) {
    super(props);
  }

  public static create(props: YearProps): Result<Year> {
    const againstNullOrUndefined = Guard.againstNullOrUndefined(props.year, 'Year');
    if (againstNullOrUndefined.isFailure) {
      return Result.fail<Year>('Year: ' + againstNullOrUndefined.getErrorValue())
    }

    const greaterThan = Guard.greaterThan(this.minLength,props.year);
    if (greaterThan.isFailure) {
      return Result.fail<Year>('Year: ' + greaterThan.getErrorValue())
    }


    return Result.ok<Year>(new Year(props));
  }
}