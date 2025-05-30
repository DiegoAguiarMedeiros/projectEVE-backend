import { Guard } from "../../../../shared/core/Guard";
import { Result } from "../../../../shared/core/Result";
import { AggregateRoot } from "../../../../shared/domain/AggregateRoot";
import { Balance } from "../../../../shared/domain/Balance";
import { Description } from "../../../../shared/domain/Description";
import { Id } from "../../../../shared/domain/Id";
import { PaymentDay } from "../../../../shared/domain/PaymentDay";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";



interface IncomeProps {
  userId: Id;
  description: Description;
  amount: Balance;
  paymentDay: PaymentDay;
}


export class Income extends AggregateRoot<IncomeProps> {

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

  private constructor(props: IncomeProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: IncomeProps, id?: UniqueEntityID): Result<Income> {

    const guardResult = Guard.againstNullOrUndefinedBulk([
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
      }, id
    );

    return Result.ok<Income>(income);
  }
}
