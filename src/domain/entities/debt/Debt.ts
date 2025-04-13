import { Balance } from "../../shared/Balance";
import { Guard } from "../../shared/core/Guard";
import { Result } from "../../shared/core/Result";
import { Description } from "../../shared/Description";
import { Id } from "../../shared/Id";
import { DebtsStatus } from "./DebtsStatus";

interface DebtProps {
  id: Id;
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
  get creditCardId(): Id {
    return this.props.creditCardId;
  }
  public updateCreditCardId(creditCardId: Id): void {
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
  get installments_total(): Balance {
    return this.props.installments_total;
  }
  public updateInstallmentsTotal(installments_total: Balance): void {
    this.props.installments_total = installments_total;
  }
  get installments_paid(): Balance {
    return this.props.installments_paid;
  }
  public updateInstallmentsPaid(installments_paid: Balance): void {
    this.props.installments_paid = installments_paid;
  }
  get dueDate(): Date {
    return this.props.dueDate;
  }
  public updateDueDate(dueDate: Date): void {
    this.props.dueDate = dueDate;
  }
  get status(): DebtsStatus {
    return this.props.status;
  }
  public updateStatus(status: DebtsStatus): void {
    this.props.status = status;
  }

  private constructor(props: DebtProps) {
    this.props = props;
  }

  public static create(props: DebtProps): Result<Debt> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.id, argumentName: "id" },
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

    const debt = new Debt(
      {
        ...props
      }
    );

    return Result.ok<Debt>(debt);
  }
}
