import { Guard } from "../../../shared/core/Guard";
import { Result } from "../../../shared/core/Result";
import { AggregateRoot } from "../../../shared/domain/AggregateRoot";
import { Balance } from "../../../shared/domain/Balance";
import { Description } from "../../../shared/domain/Description";
import { Id } from "../../../shared/domain/Id";
import { PaymentDay } from "../../../shared/domain/PaymentDay";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { IncomesCreated } from "./events/IncomesCreated";
import { IncomesDeleted } from "./events/IncomesDeleted";



interface IncomesProps {
  userId: Id;
  description: Description;
  amount: Balance;
  paymentDay: PaymentDay;
}


export class Incomes extends AggregateRoot<IncomesProps> {

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
  public delete(): void {
    this.addDomainEvent(new IncomesDeleted(this));
  }

  private constructor(props: IncomesProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: IncomesProps, id?: UniqueEntityID): Result<Incomes> {

    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.userId, argumentName: "userId" },
      { argument: props.description, argumentName: "description" },
      { argument: props.amount, argumentName: "amount" },
      { argument: props.paymentDay, argumentName: "paymentDay" },
    ]);

    if (guardResult.isFailure) {
      return Result.fail<Incomes>('Incomes :' + guardResult.getErrorValue());
    }
    const isNewIncome = !!id === false;
    const income = new Incomes(
      {
        ...props
      }, id
    );
    if (isNewIncome) {
      income.addDomainEvent(new IncomesCreated(income));
    }

    return Result.ok<Incomes>(income);
  }
}
