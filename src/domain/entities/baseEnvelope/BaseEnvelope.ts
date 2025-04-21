import { Color } from "../../shared/Color";
import { Guard } from "../../shared/core/Guard";
import { Result } from "../../shared/core/Result";
import { Id } from "../../shared/Id";
import { Name } from "../../shared/Name";

/*
#1877F2 Contas Fixas
#8E33FF Alimentação
#00B8D9 Lazer
#22C55E Transporte
#FFAB00 Saúde
#FF5630 Bem Estar
#FFD700 Dívidas
#8B0000 Investimentos
*/

export interface BaseEnvelopeProps {
  id: Id;
  name: Name;
  color: Color;
}

export class BaseEnvelope {
  private props: BaseEnvelopeProps;

  get id(): Id {
    return this.props.id;
  }
  get name(): Name {
    return this.props.name;
  }

  get color(): Color {
    return this.props.color;
  }

  private constructor(props: BaseEnvelopeProps) {
    this.props = props;
  }

  public static create(props: BaseEnvelopeProps): Result<BaseEnvelope> {

    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.color, argumentName: "color" },
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
