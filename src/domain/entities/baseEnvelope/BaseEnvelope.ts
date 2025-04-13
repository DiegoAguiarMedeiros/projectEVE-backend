import { Guard } from "../../shared/core/Guard";
import { Result } from "../../shared/core/Result";
import { Id } from "../../shared/Id";
import { Name } from "../../shared/Name";


export interface BaseEnvelopeProps {
  id: Id;
  name: Name;
}

export class BaseEnvelope {
  private props: BaseEnvelopeProps;

  get id(): Id {
    return this.props.id;
  }
  get name(): Name {
    return this.props.name;
  }


  private constructor(props: BaseEnvelopeProps) {
    this.props = props;
  }

  public static create(props: BaseEnvelopeProps): Result<BaseEnvelope> {

    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.name, argumentName: "name" },
      { argument: props.id, argumentName: "id" },
    ]);

    if (guardResult.isFailure) {
      return Result.fail<BaseEnvelope>('BaseEnvelope :' + guardResult.getErrorValue());
    }

    const baseEnvelope = new BaseEnvelope(
      {
        ...props
      }
    );

    return Result.ok<BaseEnvelope>(baseEnvelope);
  }
}
