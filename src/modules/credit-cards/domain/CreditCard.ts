
import { Guard } from "../../../shared/core/Guard";
import { Result } from "../../../shared/core/Result";
import { AggregateRoot } from "../../../shared/domain/AggregateRoot";
import { Id } from "../../../shared/domain/Id";
import { Name } from "../../../shared/domain/Name";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Flag } from "./Flag";


interface CreditCardProps {
  name: Name;
  flag: Flag;
  active: boolean;
  userId: Id;
}

export class CreditCard  extends AggregateRoot<CreditCardProps> {

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

  private constructor(props: CreditCardProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: CreditCardProps, id?: UniqueEntityID): Result<CreditCard> {

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
      },id
    );

    return Result.ok<CreditCard>(casereditCard);
  }
}
