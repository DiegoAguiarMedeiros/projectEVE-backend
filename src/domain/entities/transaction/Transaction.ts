
import { EnvelopeDTO } from "../../dto/envelope";
import { Balance } from "../../shared/Balance";
import { Guard } from "../../shared/core/Guard";
import { Result } from "../../shared/core/Result";
import { Description } from "../../shared/Description";
import { Id } from "../../shared/Id";
import { PaymentMethod } from "./PaymentMethod";
import { TransactionStatus } from "./TransactionStatus";
import { TransactionType } from "./TransactionType";


export interface TransactionProps {
  id: Id;
  creditCardId?: Id;
  envelope: EnvelopeDTO;
  description: Description;
  amount: Balance;
  paymentMethod: PaymentMethod;
  date: Date;
  type: TransactionType;
  status: TransactionStatus;
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
  get envelope(): EnvelopeDTO {
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

  private constructor(props: TransactionProps) {
    this.props = props;
  }

  public static create(props: TransactionProps): Result<Transaction> {

    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.id, argumentName: "id" },
      { argument: props.envelope, argumentName: "envelope" },
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
