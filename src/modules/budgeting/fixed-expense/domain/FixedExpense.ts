
import { EnvelopeDTO } from "../../envelope/dtos";
import { Balance } from "../../../../shared/domain/Balance";
import { Guard } from "../../../../shared/core/Guard";
import { Result } from "../../../../shared/core/Result";
import { Description } from "../../../../shared/domain/Description";
import { Id } from "../../../../shared/domain/Id";
import { PaymentDay } from "../../../../shared/domain/PaymentDay";


interface FixedExpenseProps {
  id: Id;
  envelope: EnvelopeDTO;
  description: Description;
  amount: Balance;
  paymentDay: PaymentDay;
}


export class FixedExpense {
  private props: FixedExpenseProps;

  get id(): Id {
    return this.props.id;
  }
  get envelope(): EnvelopeDTO{
    return this.props.envelope;
  }
  public updateEnvelope(envelope: EnvelopeDTO): void {
    this.props.envelope = envelope;
  }
  get description(): Description {
    return this.props.description;
  }
  public updateDescription(description: Description): void {
    this.props.description = description;
  }
  get amount(): Balance {
    return this.props.amount;
  }
  public updateAmount(amount: Balance): void {
    this.props.amount = amount;
  }
  get paymentDay(): PaymentDay {
    return this.props.paymentDay;
  }
  public updatepaymentDay(paymentDay: PaymentDay): void {
    this.props.paymentDay = paymentDay;
  }


  private constructor(props: FixedExpenseProps) {
    this.props = props;
  }

  public static create(props: FixedExpenseProps): Result<FixedExpense> {

    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.id, argumentName: "id" },
      { argument: props.envelope, argumentName: "envelope" },
      { argument: props.description, argumentName: "description" },
      { argument: props.amount, argumentName: "amount" },
      { argument: props.paymentDay, argumentName: "paymentDay" },
    ]);

    if (guardResult.isFailure) {
      return Result.fail<FixedExpense>('FixedExpense :' + guardResult.getErrorValue());
    }

    const fixedExpense = new FixedExpense(
      {
        ...props
      }
    );

    return Result.ok<FixedExpense>(fixedExpense);
  }
}
