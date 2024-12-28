import { Name } from "./name";
import { UserId } from "./userId";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Result } from "../../../shared/core/Result";
import { Guard } from "../../../shared/core/Guard";
import { EnvelopeId } from "./envelopeId";
import { Balance } from "./balance";
import { Id } from "../../../shared/domain/Id";

interface EnvelopeProps {
  id: Id;
  name: Name;
  balance: Balance;
  disable: boolean;
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
  get disable(): boolean {
    return this.props.disable;
  }
  get name(): Name {
    return this.props.name;
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
