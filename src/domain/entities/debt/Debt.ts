import { Balance } from "../../shared/Balance";
import { Guard } from "../../shared/core/Guard";
import { Result } from "../../shared/core/Result";
import { Description } from "../../shared/Description";
import { Id } from "../../shared/Id";
import { PaymentDay } from "../../shared/PaymentDay";
import { DebtsStatus } from "./DebtsStatus";

interface DebtProps {
  id: Id;
  envelopeId: Id;
  description: Description;
  amount: Balance;
  installmentsTotal: Balance;
  installmentsPaid: Balance;
  paymentDay: PaymentDay;
  status: DebtsStatus;
}


export class Debt {
  private props: DebtProps;

  get id(): Id {
    return this.props.id;
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
  get installmentsTotal(): Balance {
    return this.props.installmentsTotal;
  }
  public updateInstallmentsTotal(installmentsTotal: Balance): void {
    this.props.installmentsTotal = installmentsTotal;
  }
  get installmentsPaid(): Balance {
    return this.props.installmentsPaid;
  }
  public updateInstallmentsPaid(installmentsPaid: Balance): void {
    this.props.installmentsPaid = installmentsPaid;
  }
  get paymentDay(): PaymentDay {
    return this.props.paymentDay;
  }
  public updatepaymentDay(paymentDay: PaymentDay): void {
    this.props.paymentDay = paymentDay;
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
      { argument: props.installmentsTotal, argumentName: "installmentsTotal" },
      { argument: props.installmentsPaid, argumentName: "installmentsPaid" },
      { argument: props.paymentDay, argumentName: "paymentDay" },
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
