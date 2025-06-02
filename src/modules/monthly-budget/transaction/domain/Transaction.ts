
import { Guard } from "../../../../shared/core/Guard";
import { Result } from "../../../../shared/core/Result";
import { AggregateRoot } from "../../../../shared/domain/AggregateRoot";
import { Balance } from "../../../../shared/domain/Balance";
import { Description } from "../../../../shared/domain/Description";
import { Id } from "../../../../shared/domain/Id";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";
import { EnvelopeDTO } from "../../../budgeting/envelope/dtos";
import { PaymentMethod } from "./PaymentMethod";
import { TransactionStatus } from "./TransactionStatus";
import { TransactionType } from "./TransactionType";


export interface TransactionProps {
  creditCardId?: Id;
  debtId?: Id;
  monthlyEnvelopeId: Id;
  description: Description;
  amount: Balance;
  paymentMethod: PaymentMethod;
  date: Date;
  type: TransactionType;
  status: TransactionStatus;
}


export class Transaction  extends AggregateRoot<TransactionProps> {

  get creditCardId(): Id | undefined{
    return this.props.creditCardId;
  }
  public updateCreditCardId(creditCardId?: Id): void {
    this.props.creditCardId = creditCardId;
  }

  get debtId(): Id | undefined{
    return this.props.debtId;
  }
  public updateDebtId(debtId?: Id): void {
    this.props.debtId = debtId;
  }
  get monthlyEnvelopeId(): Id{
    return this.props.monthlyEnvelopeId;
  }
  public updateMonthlyEnvelopeId(monthlyEnvelopeId: Id): void {
    this.props.monthlyEnvelopeId = monthlyEnvelopeId;
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
  get paymentMethod(): PaymentMethod {
    return this.props.paymentMethod;
  }
  public updatePaymentMethod(paymentMethod: PaymentMethod): void {
    this.props.paymentMethod = paymentMethod;
  }
  get date(): Date {
    return this.props.date;
  }
  public updateDate(date: Date): void {
    this.props.date = date;
  }
  get type(): TransactionType {
    return this.props.type;
  }
  public updateType(type: TransactionType): void {
    this.props.type = type;
  }
  get status(): TransactionStatus {
    return this.props.status;
  }
  public updateStatus(status: TransactionStatus): void {
    this.props.status = status;
  }

  private constructor(props: TransactionProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: TransactionProps, id?: UniqueEntityID): Result<Transaction> {

    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.monthlyEnvelopeId, argumentName: "monthlyEnvelopeId" },
      { argument: props.description, argumentName: "description" },
      { argument: props.amount, argumentName: "amount" },
      { argument: props.date, argumentName: "date" },
      { argument: props.paymentMethod, argumentName: "payment_method" },
      { argument: props.status, argumentName: "status" },
    ]);

    if (guardResult.isFailure) {
      return Result.fail<Transaction>('Transaction :' + guardResult.getErrorValue());
    }

    const transaction = new Transaction(
      {
        ...props
      },id
    );

    return Result.ok<Transaction>(transaction);
  }
}
