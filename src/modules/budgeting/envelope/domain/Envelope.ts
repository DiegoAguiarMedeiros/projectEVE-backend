import { Guard } from "../../../../shared/core/Guard";
import { Result } from "../../../../shared/core/Result";
import { Color } from "../../../../shared/domain/Color";
import { Id } from "../../../../shared/domain/Id";
import { Name } from "../../../../shared/domain/Name";
import { Percentage } from "../../../../shared/domain/Percentage";



interface EnvelopeProps {
  id: Id;
  name: Name;
  color: Color;
  percentage: Percentage;
  userId: Id;
}

export class Envelope {
  private props: EnvelopeProps;

  get id(): Id {
    return this.props.id;
  }
  get name(): Name {
    return this.props.name;
  }
  public updateName(name: Name): void {
    this.props.name = name;
  }
  get color(): Color {
    return this.props.color;
  }
  public updateColor(color: Color): void {
    this.props.color = color;
  }
  get percentage(): Percentage {
    return this.props.percentage;
  }
  public updatePercentage(percentage: Percentage): void {
    this.props.percentage = percentage;
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
