
import { Balance } from "../../../shared/domain/Balance";
import { Guard } from "../../../shared/core/Guard";
import { Result } from "../../../shared/core/Result";
import { Description } from "../../../shared/domain/Description";
import { Id } from "../../../shared/domain/Id";
import { PaymentDay } from "../../../shared/domain/PaymentDay";
import { AggregateRoot } from "../../../shared/domain/AggregateRoot";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { TransactionsType } from "../../transactions/domain/TransactionsType";


interface FixedExpenseProps {
  envelopeId: Id;
  description: Description;
  amount: Balance;
  paymentDay: PaymentDay;
}


export class FixedExpense extends AggregateRoot<FixedExpenseProps> {

  get envelopeId(): Id{
    return this.props.envelopeId;
  }
  public updateEnvelopeId(envelopeId: Id): void {
    this.props.envelopeId = envelopeId;
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

  private constructor(props: FixedExpenseProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: FixedExpenseProps, id?: UniqueEntityID): Result<FixedExpense> {

    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.envelopeId, argumentName: "envelopeId" },
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
      },id
    );

    return Result.ok<FixedExpense>(fixedExpense);
  }
}
