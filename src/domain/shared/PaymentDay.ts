import { Guard } from "./core/Guard";
import { Result } from "./core/Result";
import { ValueObject } from "./ValueObject";



interface PaymentDayProps {
  paymentDay: number;
}

export class PaymentDay extends ValueObject<PaymentDayProps> {

    public static maxLength: number = 31;
    public static minLength: number = 1;

  get value(): number {
    return this.props.paymentDay;
  }

  private constructor(props: PaymentDayProps) {
    super(props);
  }

  public static create(props: PaymentDayProps): Result<PaymentDay> {
    const PaymentDayResult = Guard.againstNullOrUndefined(props.paymentDay, 'PaymentDay');
    if (PaymentDayResult.isFailure) {
      return Result.fail<PaymentDay>('PaymentDay: ' + PaymentDayResult.getErrorValue())
    }

    const minLengthResult = Guard.inRange(props.paymentDay,this.minLength,this.maxLength, 'name');
    if (minLengthResult.isFailure) {
      return Result.fail<PaymentDay>('PaymentDay: ' + minLengthResult.getErrorValue())
    }

    return Result.ok<PaymentDay>(new PaymentDay(props));
  }
}