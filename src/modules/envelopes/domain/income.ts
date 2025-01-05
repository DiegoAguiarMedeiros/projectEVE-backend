import { Name } from "./name";
import { UserId } from "./userId";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Result } from "../../../shared/core/Result";
import { Guard } from "../../../shared/core/Guard";
import { Id } from "../../../shared/domain/Id";
import { Flag } from "./flag";
import { Description } from "./description";
import { Balance } from "./balance";
import { DebtsStatus } from "./debtsStatus";

interface IncomeProps {
  id: Id;
  userId: Id;
  description: Description;
  amount: Balance;
  paymentDate: Date;
}


export class Income {
  private props: IncomeProps;

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
  get amount(): Balance {
    return this.props.amount;
  }
  public updateAmount(amount: Balance): void {
    this.props.amount = amount;
  }
  get paymentDate(): Date {
    return this.props.paymentDate;
  }
  public updatePaymentDate(paymentDate: Date): void {
    this.props.paymentDate = paymentDate;
  }

  private constructor(props: IncomeProps) {
    this.props = props;
  }

  public static create(props: IncomeProps): Result<Income> {

    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.id, argumentName: "id" },
      { argument: props.userId, argumentName: "userId" },
      { argument: props.description, argumentName: "description" },
      { argument: props.amount, argumentName: "amount" },
      { argument: props.paymentDate, argumentName: "paymentDate" },
    ]);

    if (guardResult.isFailure) {
      return Result.fail<Income>('Income :' + guardResult.getErrorValue());
    }

    const income = new Income(
      {
        ...props
      }
    );

    return Result.ok<Income>(income);
  }
}
