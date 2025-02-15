import { Mapper } from "../../../shared/infra/Mapper";
import { Debt } from "../domain/debt";
import { DebtDTO } from "../dtos/debtDTO";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Name } from "../domain/name";
import { UserId } from "../domain/userId";
import { Id } from "../../../shared/domain/Id";
import { Balance } from "../domain/balance";
import { Flag } from "../domain/flag";
import { Description } from "../domain/description";
import { Income } from "../domain/income";
import { IncomeDTO } from "../dtos/incomeDTO";

export class IncomeMap implements Mapper<Income> {
  public static toDTO(income: Income): IncomeDTO {
    return {
      id: income.id.value,
      userId: income.userId.value,
      description: income.description.value,
      amount: income.amount.value,
      paymentDay: income.paymentDay,
    };
  }

  public static toDomain(raw: any): Income {
    const DescriptionOrError = Description.create({ description: raw.description });
    DescriptionOrError.isFailure ? console.error(DescriptionOrError.getErrorValue()) : '';

    const AmountOrError = Balance.create({ balance: raw.amount });
    AmountOrError.isFailure ? console.error(AmountOrError.getErrorValue()) : '';

    const UserIdOrError = Id.create(raw.user_id);
    UserIdOrError.isFailure ? console.error(UserIdOrError.getErrorValue()) : '';

    const IdOrError = Id.create(raw.id);
    IdOrError.isFailure ? console.error(IdOrError.getErrorValue()) : '';

    const debtOrError = Income.create(
      {
        id: IdOrError.getValue(),
        userId: UserIdOrError.getValue(),
        description: DescriptionOrError.getValue(),
        amount: AmountOrError.getValue(),
        paymentDay: raw.payment_day,
      }
    );

    debtOrError.isFailure ? console.error(debtOrError.getErrorValue()) : '';

    return debtOrError.getValue();
  }

  public static async toPersistence(income: Income): Promise<any> {

    return {
      id: income.id.value,
      user_id: income.userId.value,
      description: income.description.value,
      amount: income.amount.value,
      payment_day: income.paymentDay,
    };
  }
}
