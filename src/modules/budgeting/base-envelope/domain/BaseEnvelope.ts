import { Color } from "../../../../shared/domain/Color";
import { Guard } from "../../../../shared/core/Guard";
import { Result } from "../../../../shared/core/Result";
import { Id } from "../../../../shared/domain/Id";
import { Name } from "../../../../shared/domain/Name";
import { AggregateRoot } from "../../../../shared/domain/AggregateRoot";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";

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
  name: Name;
  color: Color;
}

export class BaseEnvelope extends AggregateRoot<BaseEnvelopeProps> {

  get name(): Name {
    return this.props.name;
  }

  get color(): Color {
    return this.props.color;
  }

  private constructor(props: BaseEnvelopeProps, id?: UniqueEntityID) {
    super(props, id)
  }

  public static create(props: BaseEnvelopeProps, id?: UniqueEntityID): Result<BaseEnvelope> {

    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.color, argumentName: "color" },
      { argument: props.name, argumentName: "name" },
    ]);

    if (guardResult.isFailure) {
      return Result.fail<BaseEnvelope>('BaseEnvelope :' + guardResult.getErrorValue());
    }

    const baseEnvelope = new BaseEnvelope(
      {
        ...props
      },id
    );

    return Result.ok<BaseEnvelope>(baseEnvelope);
  }
}
