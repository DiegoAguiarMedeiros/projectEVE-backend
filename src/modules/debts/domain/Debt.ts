
import { Guard } from "../../../shared/core/Guard";
import { Result } from "../../../shared/core/Result";
import { AggregateRoot } from "../../../shared/domain/AggregateRoot";
import { Balance } from "../../../shared/domain/Balance";
import { Description } from "../../../shared/domain/Description";
import { Id } from "../../../shared/domain/Id";
import { PaymentDay } from "../../../shared/domain/PaymentDay";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { DebtsStatus } from "./DebtsStatus";
import { DebtCreated } from "./events/debtCreated";
import { DebtUpdated } from "./events/debtUpdated";
import { DebtDeleted } from "./events/debtDeleted";

interface DebtProps {
  description: Description;
  amount: Balance;
  installmentsTotal: Balance;
  installmentsPaid: Balance;
  paymentDay: PaymentDay;
  status: DebtsStatus;
  envelopeId: Id;
}


export class Debt extends AggregateRoot<DebtProps> {

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
  get envelopeId(): Id {
    return this.props.envelopeId;
  }
  get status(): DebtsStatus {
    return this.props.status;
  }
  public updateStatus(status: DebtsStatus): void {
    this.props.status = status;
  }
  public markUpdated(): void {
    this.addDomainEvent(new DebtUpdated(this));
  }
  public delete(): void {
    this.addDomainEvent(new DebtDeleted(this));
  }

  private constructor(props: DebtProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: DebtProps, id?: UniqueEntityID): Result<Debt> {

    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.description, argumentName: "description" },
      { argument: props.amount, argumentName: "amount" },
      { argument: props.installmentsTotal, argumentName: "installmentsTotal" },
      { argument: props.installmentsPaid, argumentName: "installmentsPaid" },
      { argument: props.paymentDay, argumentName: "paymentDay" },
      { argument: props.status, argumentName: "status" },
      { argument: props.envelopeId, argumentName: "envelopeId" },
    ]);

    if (guardResult.isFailure) {
      return Result.fail<Debt>('Debt :' + guardResult.getErrorValue());
    }
    const isNewDebt = !!id === false;
    const debt = new Debt(
      {
        ...props
      }, id
    );


    if (isNewDebt) {
      debt.addDomainEvent(new DebtCreated(debt));
    }
    return Result.ok<Debt>(debt);
  }
}
