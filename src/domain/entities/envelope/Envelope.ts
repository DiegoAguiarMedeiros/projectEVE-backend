import { Balance } from "../../shared/Balance";
import { Guard } from "../../shared/core/Guard";
import { Result } from "../../shared/core/Result";
import { Id } from "../../shared/Id";
import { Name } from "../../shared/Name";
import { Color } from "../../shared/Color";
import { Percentage } from "./Percentage";


interface EnvelopeProps {
  id: Id;
  name: Name;
  balance: Balance;
  color: Color;
  percentage: Percentage;
  active: boolean;
  is_editable: boolean;
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
  get active(): boolean {
    return this.props.active;
  }
  public updateActive(active: boolean): void {
    this.props.active = active;
  }
  get is_editable(): boolean {
    return this.props.is_editable;
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
