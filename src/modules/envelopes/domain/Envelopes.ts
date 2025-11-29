import { Guard } from "../../../shared/core/Guard";
import { Result } from "../../../shared/core/Result";
import { AggregateRoot } from "../../../shared/domain/AggregateRoot";
import { Balance } from "../../../shared/domain/Balance";
import { Color } from "../../../shared/domain/Color";
import { Id } from "../../../shared/domain/Id";
import { Name } from "../../../shared/domain/Name";
import { Percentage } from "../../../shared/domain/Percentage";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";



interface EnvelopesProps {
  name: Name;
  color: Color;
  percentage: Percentage;
  userId: Id;
  order: Balance;
  amount?: Balance;
  used?: Percentage;
}

export class Envelopes extends AggregateRoot<EnvelopesProps> {

  get name(): Name {
    return this.props.name;
  }
  public updateName(name: Name): void {
    this.props.name = name;
  }
  get color(): Color {
    return this.props.color;
  }
  get order(): Balance {
    return this.props.order;
  }
  get amount(): Balance | undefined {
    return this.props.amount;
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
  get used(): Percentage | undefined {
    return this.props.used;
  }
  public updateUsed(used: Percentage): void {
    this.props.used = used;
  }
  get userId(): Id {
    return this.props.userId;
  }

  private constructor(props: EnvelopesProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: EnvelopesProps, id?: UniqueEntityID): Result<Envelopes> {

    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.name, argumentName: "name" },
      { argument: props.userId, argumentName: "userId" },
      { argument: props.color, argumentName: "color" },
      { argument: props.order, argumentName: "order" },
    ]);

    if (guardResult.isFailure) {
      return Result.fail<Envelopes>('Envelopes :' + guardResult.getErrorValue());
    }

    const envelope = new Envelopes(
      {
        ...props
      },
      id
    );

    return Result.ok<Envelopes>(envelope);
  }
}
