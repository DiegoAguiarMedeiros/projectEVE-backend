import { Guard } from "../../../../shared/core/Guard";
import { Result } from "../../../../shared/core/Result";
import { Balance } from "../../../../shared/domain/Balance";
import { Description } from "../../../../shared/domain/Description";
import { Id } from "../../../../shared/domain/Id";
import { PaymentDay } from "../../../../shared/domain/PaymentDay";



interface IncomeProps {
  id: Id;
  userId: Id;
  description: Description;
  amount: Balance;
  paymentDay: PaymentDay;
}


export class Income {
  private props: IncomeProps;

  get id(): Id {
    return this.props.id;
  }
  get userId(): Id {
    return this.props.userId;
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

  private constructor(props: IncomeProps) {
    this.props = props;
  }

  public static create(props: IncomeProps): Result<Income> {

    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.id, argumentName: "id" },
      { argument: props.userId, argumentName: "userId" },
      { argument: props.description, argumentName: "description" },
      { argument: props.amount, argumentName: "amount" },
      { argument: props.paymentDay, argumentName: "paymentDay" },
    ]);

    if (guardResult.isFailure) {
      return Result.fail<Income>('Income :' + guardResult.getErrorValue());
    }

    const income = new Income(
      {
        ...props
      }
    );

    return Result.ok<Income>(income);
  }
}
