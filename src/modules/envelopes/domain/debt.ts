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

interface DebtProps {
  id: Id;
  userId: Id;
  creditCardId: Id;
  envelopeId: Id;
  description: Description;
  amount: Balance;
  installments_total: Balance;
  installments_paid: Balance;
  dueDate: Date;
  status: DebtsStatus;
}


export class Debt {
  private props: DebtProps;

  get id(): Id {
    return this.props.id;
  }
  get userId(): Id {
    return this.props.userId;
  }
  get creditCardId(): Id {
    return this.props.creditCardId;
  }
  get envelopeId(): Id {
    return this.props.envelopeId;
  }
  get description(): Description {
    return this.props.description;
  }
  get amount(): Balance {
    return this.props.amount;
  }
  get installments_total(): Balance {
    return this.props.installments_total;
  }
  get installments_paid(): Balance {
    return this.props.installments_paid;
  }
  get dueDate(): Date {
    return this.props.dueDate;
  }
  get status(): DebtsStatus {
    return this.props.status;
  }


  private constructor(props: DebtProps) {
    this.props = props;
  }

  public static create(props: DebtProps): Result<Debt> {

    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.id, argumentName: "id" },
      { argument: props.userId, argumentName: "userId" },
      { argument: props.envelopeId, argumentName: "envelopeId" },
      { argument: props.description, argumentName: "description" },
      { argument: props.amount, argumentName: "amount" },
      { argument: props.installments_total, argumentName: "installments_total" },
      { argument: props.installments_paid, argumentName: "installments_paid" },
      { argument: props.dueDate, argumentName: "dueDate" },
      { argument: props.status, argumentName: "status" },
    ]);

    if (guardResult.isFailure) {
      return Result.fail<Debt>('Debt :' + guardResult.getErrorValue());
    }

    const casereditCard = new Debt(
      {
        ...props
      }
    );

    return Result.ok<Debt>(casereditCard);
  }
}
