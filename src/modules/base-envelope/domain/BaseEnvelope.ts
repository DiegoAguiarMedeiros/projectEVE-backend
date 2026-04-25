import { Color } from "../../../shared/domain/Color";
import { Guard } from "../../../shared/core/Guard";
import { Result } from "../../../shared/core/Result";
import { Id } from "../../../shared/domain/Id";
import { Name } from "../../../shared/domain/Name";
import { AggregateRoot } from "../../../shared/domain/AggregateRoot";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Balance } from "../../../shared/domain/Balance";
import { Percentage } from "../../../shared/domain/Percentage";

/*
#1877F2 METAS
#8B0000 Dívidas
#8E33FF MORADIA
#00B8D9 MERCADO
#22C55E SAÚDE
#FFAB00 LAZER
#FF5630 TRANSPORTE
#FFD700 OUTROS
*/

export interface BaseEnvelopeProps {
  name: Name;
  color: Color;
  order: Balance;
  percentage: Percentage;
}

export class BaseEnvelope extends AggregateRoot<BaseEnvelopeProps> {

  get name(): Name {
    return this.props.name;
  }

  get color(): Color {
    return this.props.color;
  }

  get order(): Balance {
    return this.props.order;
  }

  get percentage(): Percentage {
    return this.props.percentage;
  }

  private constructor(props: BaseEnvelopeProps, id?: UniqueEntityID) {
    super(props, id)
  }

  public static create(props: BaseEnvelopeProps, id?: UniqueEntityID): Result<BaseEnvelope> {

    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.color, argumentName: "color" },
      { argument: props.name, argumentName: "name" },
      { argument: props.order, argumentName: "order" },
      { argument: props.percentage, argumentName: "percentage" },
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
