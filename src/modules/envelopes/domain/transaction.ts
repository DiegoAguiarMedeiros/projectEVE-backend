import { Name } from "./name";
import { UserId } from "./userId";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Result } from "../../../shared/core/Result";
import { Guard } from "../../../shared/core/Guard";
import { Id } from "../../../shared/domain/Id";
import { Flag } from "./flag";
import { Description } from "./description";
import { Balance } from "./balance";
import { TransactionsStatus } from "./transactionsStatus";
import { PaymentMethod } from "./paymentMethod";
import { TransactionsType } from "./transactionsType";

interface TransactionProps {
  id: Id;
  creditCardId?: Id;
  envelopeId: Id;
  description: Description;
  amount: Balance;
  paymentMethod: PaymentMethod;
  date: Date;
  type: TransactionsType;
  status: TransactionsStatus;
}


export class Transaction {
  private props: TransactionProps;

  get id(): Id {
    return this.props.id;
  }
  get creditCardId(): Id | undefined{
    return this.props.creditCardId;
  }
  public updateCreditCardId(creditCardId?: Id): void {
    this.props.creditCardId = creditCardId;
  }
  get envelopeId(): Id {
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
  get type(): TransactionsType {
    return this.props.type;
  }
  public updateType(type: TransactionsType): void {
    this.props.type = type;
  }
  get status(): TransactionsStatus {
    return this.props.status;
  }
  public updateStatus(status: TransactionsStatus): void {
    this.props.status = status;
  }

  private constructor(props: TransactionProps) {
    this.props = props;
  }

  public static create(props: TransactionProps): Result<Transaction> {

    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.id, argumentName: "id" },
      { argument: props.creditCardId, argumentName: "creditCardId" },
      { argument: props.envelopeId, argumentName: "envelopeId" },
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
      }
    );

    return Result.ok<Transaction>(transaction);
  }
}
