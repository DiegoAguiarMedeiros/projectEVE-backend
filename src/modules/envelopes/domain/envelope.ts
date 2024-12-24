import { Name } from "./name";
import { UserId } from "./userId";
import { EnvelopeCreated } from "./events/envelopeCreated";
import { JWTToken, RefreshToken } from "./jwt";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Result } from "../../../shared/core/Result";
import { Guard } from "../../../shared/core/Guard";
import { AggregateRoot } from "../../../shared/domain/AggregateRoot";

interface EnvelopeProps {
  name: Name;
  userId: UserId;
}

export class Envelope extends AggregateRoot<EnvelopeProps> {


  get name(): Name {
    return this.props.name;
  }
  get userId(): UserId {
    return this.props.userId;
  }

  private constructor(props: EnvelopeProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: EnvelopeProps, id?: UniqueEntityID): Result<Envelope> {

    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.name, argumentName: "name" },
      { argument: props.userId, argumentName: "userId" },
    ]);

    if (guardResult.isFailure) {
      return Result.fail<Envelope>('Envelope :' + guardResult.getErrorValue());
    }

    const isNewEnvelope = !!id === false;
    const envelope = new Envelope(
      {
        ...props
      },
      id
    );

    if (isNewEnvelope) {
      envelope.addDomainEvent(new EnvelopeCreated(envelope));
    }

    return Result.ok<Envelope>(envelope);
  }
}
