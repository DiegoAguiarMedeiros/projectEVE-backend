
import { Guard } from "../../../../shared/core/Guard";
import { Result } from "../../../../shared/core/Result";
import { Balance } from "../../../../shared/domain/Balance";
import { Id } from "../../../../shared/domain/Id";
import { Percentage } from "../../../../shared/domain/Percentage";
import { Reference } from "./Reference";



interface MonthlyEnvelopeProps {
  id: Id;
  balance: Balance;
  percentage: Percentage;
  reference: Reference;
  envelopeId: Id;
}

export class MonthlyEnvelope {
  private props: MonthlyEnvelopeProps;

  get id(): Id {
    return this.props.id;
  }
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


  private constructor(props: MonthlyEnvelopeProps) {
    this.props = props;
  }

  public static create(props: MonthlyEnvelopeProps): Result<MonthlyEnvelope> {

    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.envelopeId, argumentName: "envelopeId" },
      { argument: props.balance, argumentName: "balance" },
      { argument: props.percentage, argumentName: "percentage" },
      { argument: props.reference, argumentName: "reference" },
    ]);

    if (guardResult.isFailure) {
      return Result.fail<MonthlyEnvelope>('MonthlyEnvelope :' + guardResult.getErrorValue());
    }

    const envelope = new MonthlyEnvelope(
      {
        ...props
      }
    );

    return Result.ok<MonthlyEnvelope>(envelope);
  }
}
