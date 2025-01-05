import { Name } from "./name";
import { UserId } from "./userId";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Result } from "../../../shared/core/Result";
import { Guard } from "../../../shared/core/Guard";
import { Balance } from "./balance";
import { Id } from "../../../shared/domain/Id";
import { Flag } from "./flag";

interface CreditCardProps {
  id: Id;
  name: Name;
  flag: Flag;
  active: boolean;
  userId: Id;
}

export class CreditCard {
  private props: CreditCardProps;

  get id(): Id {
    return this.props.id;
  }
  get flag(): Flag {
    return this.props.flag;
  }
  public updateFlag(flag: Flag): void {
    this.props.flag = flag;
  }
  get active(): boolean {
    return this.props.active;
  }
  get name(): Name {
    return this.props.name;
  }
  public updateName(name: Name): void {
    this.props.name = name;
  }
  get userId(): Id {
    return this.props.userId;
  }

  private constructor(props: CreditCardProps) {
    this.props = props;
  }

  public static create(props: CreditCardProps): Result<CreditCard> {

    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.name, argumentName: "name" },
      { argument: props.userId, argumentName: "userId" },
    ]);

    if (guardResult.isFailure) {
      return Result.fail<CreditCard>('CreditCard :' + guardResult.getErrorValue());
    }

    const casereditCard = new CreditCard(
      {
        ...props
      }
    );

    return Result.ok<CreditCard>(casereditCard);
  }
}
