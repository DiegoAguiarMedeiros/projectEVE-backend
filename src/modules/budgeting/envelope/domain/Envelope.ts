import { Guard } from "../../../../shared/core/Guard";
import { Result } from "../../../../shared/core/Result";
import { AggregateRoot } from "../../../../shared/domain/AggregateRoot";
import { Color } from "../../../../shared/domain/Color";
import { Id } from "../../../../shared/domain/Id";
import { Name } from "../../../../shared/domain/Name";
import { Percentage } from "../../../../shared/domain/Percentage";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";



interface EnvelopeProps {
  name: Name;
  color: Color;
  percentage: Percentage;
  userId: Id;
}

export class Envelope extends AggregateRoot<EnvelopeProps> {

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

    const envelope = new Envelope(
      {
        ...props
      },
      id
    );

    return Result.ok<Envelope>(envelope);
  }
}
