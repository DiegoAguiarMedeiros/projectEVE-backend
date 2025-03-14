import { Mapper } from "../../../shared/infra/Mapper";
import { CreditCard } from "../domain/creditCard";
import { CreditCardDTO } from "../dtos/creditCardDTO";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Name } from "../domain/name";
import { UserId } from "../domain/userId";
import { Id } from "../../../shared/domain/Id";
import { Balance } from "../domain/balance";
import { Flag } from "../domain/flag";

export class CreditCardMap implements Mapper<CreditCard> {
  public static toDTO(CreditCard: CreditCard): CreditCardDTO {
    return {
      id: CreditCard.id.value,
      name: CreditCard.name.value,
      flag: CreditCard.flag.value,
      active: CreditCard.active,
      userId: CreditCard.userId.value,
    };
  }

  public static toDomain(raw: any): CreditCard {
    const NameOrError = Name.create({ name: raw.name });
    const FlagOrError = Flag.create({ flag: raw.flag });
    const UserIdOrError = Id.create(raw.user_id);
    const IdOrError = Id.create(raw.id);

    if (NameOrError.isFailure) {
      throw new Error('Invalid use name');
    }
    if (UserIdOrError.isFailure) {
      throw new Error('Invalid use id');
    }

    const CreditCardOrError = CreditCard.create(
      {
        name: NameOrError.getValue(),
        flag: FlagOrError.getValue(),
        userId: UserIdOrError.getValue(),
        id: IdOrError.getValue(),
        active: raw.active,
      }
    );

    if (CreditCardOrError.isFailure) {
      throw new Error('Failed to create CreditCard');
    }
    return CreditCardOrError.getValue();
  }

  public static async toPersistence(CreditCard: CreditCard): Promise<any> {

    return {
      id: CreditCard.id.value,
      name: CreditCard.name.value,
      flag: CreditCard.flag.value,
      active: CreditCard.active,
      user_id: CreditCard.userId.value,
    };
  }
}
