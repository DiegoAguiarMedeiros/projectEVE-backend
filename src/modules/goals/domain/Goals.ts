
import { Balance } from "../../../shared/domain/Balance";
import { Guard } from "../../../shared/core/Guard";
import { Result } from "../../../shared/core/Result";
import { Description } from "../../../shared/domain/Description";
import { Id } from "../../../shared/domain/Id";
import { PaymentDay } from "../../../shared/domain/PaymentDay";
import { AggregateRoot } from "../../../shared/domain/AggregateRoot";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { TransactionsType } from "../../transactions/domain/TransactionsType";
import { Percentage } from "../../../shared/domain/Percentage";


interface GoalsProps {
  envelopeId: Id;
  description: Description;
  percentage: Percentage;
  amount: Balance;
  amountTotal: Balance;
  deadline: number;
  monthYear: boolean;
}


export class Goals extends AggregateRoot<GoalsProps> {

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
  get amountTotal(): Balance {
    return this.props.amountTotal;
  }
  public updateAmountTotal(amountTotal: Balance): void {
    this.props.amountTotal = amountTotal;
  }
  get percentage(): Percentage {
    return this.props.percentage;
  }
  public updatePercentage(percentage: Percentage): void {
    this.props.percentage = percentage;
  }
  get deadline(): number {
    return this.props.deadline;
  }
  public updateDeadline(deadline: number): void {
    this.props.deadline = deadline;
  }
  get monthYear(): boolean {
    return this.props.monthYear;
  }
  public updateMonthYear(monthYear: boolean): void {
    this.props.monthYear = monthYear;
  }

  private constructor(props: GoalsProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: GoalsProps, id?: UniqueEntityID): Result<Goals> {

    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.envelopeId, argumentName: "envelopeId" },
      { argument: props.description, argumentName: "description" },
      { argument: props.amount, argumentName: "amount" },
      { argument: props.percentage, argumentName: "percentage" },
      { argument: props.deadline, argumentName: "deadline" },
      { argument: props.monthYear, argumentName: "monthYear" },
    ]);

    if (guardResult.isFailure) {
      return Result.fail<Goals>('Goals :' + guardResult.getErrorValue());
    }

    const fixedExpense = new Goals(
      {
        ...props
      }, id
    );

    return Result.ok<Goals>(fixedExpense);
  }
}
