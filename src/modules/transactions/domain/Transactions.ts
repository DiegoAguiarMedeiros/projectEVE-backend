
import { Guard } from "../../../shared/core/Guard";
import { Result } from "../../../shared/core/Result";
import { AggregateRoot } from "../../../shared/domain/AggregateRoot";
import { Balance } from "../../../shared/domain/Balance";
import { Description } from "../../../shared/domain/Description";
import { Id } from "../../../shared/domain/Id";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { TransactionsCreated } from "./events/TransactionsCreated";
import { TransactionsUpdated } from "./events/TransactionsUpdated";
import { PaymentMethod } from "./PaymentMethod";
import { TransactionsStatus } from "./TransactionsStatus";
import { TransactionsType } from "./TransactionsType";


export interface TransactionsProps {
  description: Description;
  amount: Balance;
  date: Date;
  type: TransactionsType;
  paymentMethod: PaymentMethod;
  status: TransactionsStatus;
  envelopeId: Id;
  creditCardId?: Id;
  creditCardName?: string;
  processedIncomesId?: Id;
  debtId?: Id;
  isTranslatable?: boolean;
}


export class Transactions extends AggregateRoot<TransactionsProps> {

  get envelopeId(): Id {
    return this.props.envelopeId || '';
  }
  get creditCardId(): Id | undefined {
    return this.props.creditCardId;
  }
  get creditCardName(): string | undefined {
    return this.props.creditCardName;
  }
  public updateCreditCardId(creditCardId: Id | undefined): void {
    this.props.creditCardId = creditCardId;
  }
  get processedIncomesId(): Id | undefined {
    return this.props.processedIncomesId;
  }
  get debtId(): Id | undefined {
    return this.props.debtId;
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
  get date(): Date {
    return this.props.date;
  }
  public updateDate(date: Date): void {
    this.props.date = date;
  }
  get paymentMethod(): PaymentMethod {
    return this.props.paymentMethod;
  }
  public updatePaymentMethod(paymentMethod: PaymentMethod): void {
    this.props.paymentMethod = paymentMethod;
  }
  get type(): TransactionsType {
    return this.props.type;
  }
  get status(): TransactionsStatus {
    return this.props.status;
  }
  public updateStatus(status: TransactionsStatus): void {
    this.props.status = status;
  }

  get isTranslatable(): boolean {
    return this.props.isTranslatable ?? false;
  }

  public delete(): void {
    // this.addDomainEvent(new IncomesDeleted(this));
  }

  public update(transactions: Transactions, oldAmount: Balance, newAmount: Balance, userId: UniqueEntityID): void {
    this.addDomainEvent(new TransactionsUpdated(transactions, oldAmount, newAmount, userId));
  }

  private constructor(props: TransactionsProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: TransactionsProps, id?: UniqueEntityID): Result<Transactions> {

    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.envelopeId, argumentName: "envelopeId" },
      { argument: props.description, argumentName: "description" },
      { argument: props.amount, argumentName: "amount" },
      { argument: props.date, argumentName: "date" },
      { argument: props.status, argumentName: "status" },
    ]);

    if (guardResult.isFailure) {
      return Result.fail<Transactions>('Transactions :' + guardResult.getErrorValue());
    }

    const isNewTransactions = !!id === false;
    const transactions = new Transactions(
      {
        ...props
      }, id
    );
    if (isNewTransactions) {
      transactions.addDomainEvent(new TransactionsCreated(transactions));
    }



    return Result.ok<Transactions>(transactions);
  }
}
