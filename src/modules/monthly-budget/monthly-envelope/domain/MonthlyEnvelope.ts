
import { Guard } from "../../../../shared/core/Guard";
import { Result } from "../../../../shared/core/Result";
import { AggregateRoot } from "../../../../shared/domain/AggregateRoot";
import { Balance } from "../../../../shared/domain/Balance";
import { Id } from "../../../../shared/domain/Id";
import { Percentage } from "../../../../shared/domain/Percentage";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";
import { Reference } from "./Reference";



interface MonthlyEnvelopeProps {
  balance: Balance;
  percentage: Percentage;
  reference: Reference;
  envelopeId: Id;
}

export class MonthlyEnvelope extends AggregateRoot<MonthlyEnvelopeProps> {

  get balance(): Balance {
    return this.props.balance;
  }
  public updateBalance(balance: Balance): void {
    this.props.balance = balance;
  }
  get percentage(): Percentage {
    return this.props.percentage;
  }
  public updatePercentage(percentage: Percentage): void {
    this.props.percentage = percentage;
  }  
  get reference(): Reference {
    return this.props.reference;
  }
  public updateReference(reference: Reference): void {
    this.props.reference = reference;
  }  
  get envelopeId(): Id {
    return this.props.envelopeId;
  }


  private constructor(props: MonthlyEnvelopeProps, id?: UniqueEntityID) {
    super(props,id)
  }

  public static create(props: MonthlyEnvelopeProps, id?: UniqueEntityID): Result<MonthlyEnvelope> {

    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.envelopeId, argumentName: "envelopeId" },
      { argument: props.balance, argumentName: "balance" },
      { argument: props.percentage, argumentName: "percentage" },
      { argument: props.reference, argumentName: "reference" },
    ]);

    if (guardResult.isFailure) {
      return Result.fail<MonthlyEnvelope>('MonthlyEnvelope :' + guardResult.getErrorValue());
    }

    const monthlyEnvelope = new MonthlyEnvelope(
      {
        ...props
      },id
    );

    return Result.ok<MonthlyEnvelope>(monthlyEnvelope);
  }
}
