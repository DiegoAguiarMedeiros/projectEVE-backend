import { Name } from "./name";
import { UserId } from "./userId";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Result } from "../../../shared/core/Result";
import { Guard } from "../../../shared/core/Guard";
import { Id } from "../../../shared/domain/Id";
import { Flag } from "./flag";
import { Description } from "./description";
import { Balance } from "./balance";
import { InvestmentsStatus } from "./investmentsStatus";
import { InvestmentsType } from "./investmentsType";

interface InvestmentsProps {
  id: Id;
  userId: Id;
  description: Description;
  type: InvestmentsType;
  amount: Balance;
  applicationDate: Date;
  maturityDate: Date;
  status: InvestmentsStatus;
}


export class Investments {
  private props: InvestmentsProps;

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
  get type(): InvestmentsType {
    return this.props.type;
  }
  public updateType(type: InvestmentsType): void {
    this.props.type = type;
  }
  get amount(): Balance {
    return this.props.amount;
  }
  public updateAmount(amount: Balance): void {
    this.props.amount = amount;
  }
  get applicationDate(): Date {
    return this.props.applicationDate;
  }
  public updateApplicationDate(applicationDate: Date): void {
    this.props.applicationDate = applicationDate;
  }
  get maturityDate(): Date {
    return this.props.maturityDate;
  }
  public updateMaturityDate(maturityDate: Date): void {
    this.props.maturityDate = maturityDate;
  }
  get status(): InvestmentsStatus {
    return this.props.status;
  }
  public updateStatus(status: InvestmentsStatus): void {
    this.props.status = status;
  }


  private constructor(props: InvestmentsProps) {
    this.props = props;
  }

  public static create(props: InvestmentsProps): Result<Investments> {

    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.id, argumentName: "id" },
      { argument: props.userId, argumentName: "userId" },
      { argument: props.description, argumentName: "description" },
      { argument: props.amount, argumentName: "amount" },
      { argument: props.applicationDate, argumentName: "applicationDate" },
      { argument: props.maturityDate, argumentName: "maturityDate" },
      { argument: props.status, argumentName: "status" },
    ]);

    if (guardResult.isFailure) {
      return Result.fail<Investments>('Investment :' + guardResult.getErrorValue());
    }

    const investments = new Investments(
      {
        ...props
      }
    );

    return Result.ok<Investments>(investments);
  }
}
