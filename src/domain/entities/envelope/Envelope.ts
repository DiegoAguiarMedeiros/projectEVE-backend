import { Balance } from "../../shared/Balance";
import { Guard } from "../../shared/core/Guard";
import { Result } from "../../shared/core/Result";
import { Id } from "../../shared/Id";
import { Name } from "../../shared/Name";


interface EnvelopeProps {
  id: Id;
  name: Name;
  balance: Balance;
  active: boolean;
  is_editable: boolean;
  userId: Id;
}

export class Envelope {
  private props: EnvelopeProps;

  get id(): Id {
    return this.props.id;
  }
  get balance(): Balance {
    return this.props.balance;
  }
  get active(): boolean {
    return this.props.active;
  }
  get is_editable(): boolean {
    return this.props.is_editable;
  }
  get name(): Name {
    return this.props.name;
  }
  public updateName(name: Name): void {
    this.props.name = name;
  }
  get userId(): Id {
    return this.props.userId;
  }

  private constructor(props: EnvelopeProps) {
    this.props = props;
  }

  public static create(props: EnvelopeProps): Result<Envelope> {

    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.name, argumentName: "name" },
      { argument: props.userId, argumentName: "userId" },
    ]);

    if (guardResult.isFailure) {
      return Result.fail<Envelope>('Envelope :' + guardResult.getErrorValue());
    }

    const envelope = new Envelope(
      {
        ...props
      }
    );

    return Result.ok<Envelope>(envelope);
  }
}
