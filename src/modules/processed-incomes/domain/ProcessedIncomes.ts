import { Guard } from "../../../shared/core/Guard";
import { Result } from "../../../shared/core/Result";
import { AggregateRoot } from "../../../shared/domain/AggregateRoot";
import { Balance } from "../../../shared/domain/Balance";
import { Description } from "../../../shared/domain/Description";
import { Id } from "../../../shared/domain/Id";
import { PaymentDay } from "../../../shared/domain/PaymentDay";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Day } from "./Day";
import { ProcessedIncomeCreated } from "./events/ProcessedIncomeCreated";
import { ProcessedIncomeDeleted } from "./events/ProcessedIncomeDeleted";
import { ProcessedIncomeUpdated } from "./events/ProcessedIncomeUpdated";
import { Month } from "./Month";
import { Year } from "./Year";



interface ProcessedIncomesProps {
  userId: Id;
  description: Description;
  day: Day;
  month: Month;
  year: Year;
  totalIncomeProcessed: Balance;
  auxId?: Id;
  envelopeId?: Id;
  processedAt: Date;
  isReprocessed: boolean;
  isSplitted: boolean;
  shouldAddFixedExpenses?: boolean;
}


export class ProcessedIncomes extends AggregateRoot<ProcessedIncomesProps> {

  get userId(): Id {
    return this.props.userId;
  }
  get description(): Description {
    return this.props.description;
  }
  public updateDescription(description: Description): void {
    this.props.description = description;
  }

  get day(): Day {
    return this.props.day;
  }
  get month(): Month {
    return this.props.month;
  }
  public updateMonth(month: Month): void {
    this.props.month = month;
  }
  get year(): Year {
    return this.props.year;
  }
  public updateYear(year: Year): void {
    this.props.year = year;
  }

  get totalIncomeProcessed(): Balance {
    return this.props.totalIncomeProcessed;
  }
  public updateTotalIncomeProcessed(totalIncomeProcessed: Balance): void {
    this.props.totalIncomeProcessed = totalIncomeProcessed;
  }

  get auxId(): Id | undefined {
    return this.props.auxId;
  }
  get envelopeId(): Id | undefined {
    return this.props.envelopeId;
  }
  public updateEnvelopeId(envelopeId: Id | undefined): void {
    this.props.envelopeId = envelopeId;
  }
  get processedAt(): Date {
    return this.props.processedAt;
  }
  get isReprocessed(): boolean {
    return this.props.isReprocessed;
  }
  public updateIsReprocessed(isReprocessed: boolean): void {
    this.props.isReprocessed = isReprocessed;
  }
  get isSplitted(): boolean {
    return this.props.isSplitted;
  }
  get shouldAddFixedExpenses(): boolean {
    return this.props.shouldAddFixedExpenses ?? true;
  }
  private constructor(props: ProcessedIncomesProps, id?: UniqueEntityID) {
    super(props, id);
  }
  public update(): void {
    this.addDomainEvent(new ProcessedIncomeUpdated(this));
  }

  public delete(): void {
    this.addDomainEvent(new ProcessedIncomeDeleted(this));
  }

  public static create(props: ProcessedIncomesProps, id?: UniqueEntityID): Result<ProcessedIncomes> {

    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.userId, argumentName: "userId" },
      { argument: props.day, argumentName: "day" },
      { argument: props.month, argumentName: "month" },
      { argument: props.year, argumentName: "year" },
      { argument: props.totalIncomeProcessed, argumentName: "totalIncomeProcessed" },
      { argument: props.isReprocessed, argumentName: "isReprocessed" },
      { argument: props.isSplitted, argumentName: "isSplitted" },
    ]);

    if (guardResult.isFailure) {
      return Result.fail<ProcessedIncomes>('ProcessedIncomes :' + guardResult.getErrorValue());
    }

    const isNewProcessedIncomes = !!id === false;
    const processedIncome = new ProcessedIncomes(
      {
        ...props
      }, id
    );

    if (isNewProcessedIncomes) {
      processedIncome.addDomainEvent(new ProcessedIncomeCreated(processedIncome));
    }

    return Result.ok<ProcessedIncomes>(processedIncome);
  }
}
