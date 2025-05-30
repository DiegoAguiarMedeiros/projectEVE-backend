import { IncomeDTO } from "../dtos";
import { Balance } from "../../../../shared/domain/Balance";
import { Description } from "../../../../shared/domain/Description";
import { Id } from "../../../../shared/domain/Id";
import { PaymentDay } from "../../../../shared/domain/PaymentDay";
import { Mapper } from "../../../../shared/mappers/Mapper";
import { Income } from "../domain";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";


export class IncomeMap implements Mapper<Income> {
  public static toDTO(income: Income): IncomeDTO {
    return {
      id: income.id.toString(),
      userId: income.userId.value,
      description: income.description.value,
      amount: income.amount.value,
      paymentDay: income.paymentDay.value,
    };
  }

  public static toDomain(raw: any): Income {
    const DescriptionOrError = Description.create({ description: raw.description });
    DescriptionOrError.isFailure ? console.error(DescriptionOrError.getErrorValue()) : '';

    const AmountOrError = Balance.create({ balance: raw.amount });
    AmountOrError.isFailure ? console.error(AmountOrError.getErrorValue()) : '';

    const UserIdOrError = Id.create(raw.user_id);
    UserIdOrError.isFailure ? console.error(UserIdOrError.getErrorValue()) : '';
    
    const PaymentDayOrError = PaymentDay.create({ paymentDay: raw.payment_day });
    PaymentDayOrError.isFailure ? console.error(PaymentDayOrError.getErrorValue()) : '';

    const debtOrError = Income.create(
      {
        userId: UserIdOrError.getValue(),
        description: DescriptionOrError.getValue(),
        amount: AmountOrError.getValue(),
        paymentDay: PaymentDayOrError.getValue(),
      }, new UniqueEntityID(raw.id));

    debtOrError.isFailure ? console.error(debtOrError.getErrorValue()) : '';

    return debtOrError.getValue();
  }

  public static async toPersistence(income: Income): Promise<any> {
    return {
      id: income.id.toString(),
      user_id: income.userId.value,
      description: income.description.value,
      amount: income.amount.value,
      payment_day: income.paymentDay.value,
    };
  }
}
