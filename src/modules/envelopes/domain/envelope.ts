import { Name } from "./name";
import { UserId } from "./userId";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Result } from "../../../shared/core/Result";
import { Guard } from "../../../shared/core/Guard";

interface EnvelopeProps {
  name: Name;
  userId: UserId;
}

export class Envelope {
  private props: EnvelopeProps;

  get name(): Name {
    return this.props.name;
  }
  get userId(): UserId {
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
