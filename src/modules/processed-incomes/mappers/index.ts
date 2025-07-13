import { ProcessedIncomesDTO } from "../dtos";
import { Balance } from "../../../shared/domain/Balance";
import { Description } from "../../../shared/domain/Description";
import { Id } from "../../../shared/domain/Id";
import { PaymentDay } from "../../../shared/domain/PaymentDay";
import { Mapper } from "../../../shared/mappers/Mapper";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { ProcessedIncomes } from "../domain";
import { Month } from "../domain/Month";
import { Year } from "../domain/Year";


export class ProcessedIncomesMap implements Mapper<ProcessedIncomes> {
  public static toDTO(income: ProcessedIncomes): ProcessedIncomesDTO {
    return {
      id: income.id.toString(),
      userId: income.userId.value,
      month: income.month.value,
      year: income.year.value,
      totalIncomeProcessed: income.totalIncomeProcessed.value,
      isReprocessed: income.isReprocessed,
      isSplitted: income.isSplitted,
      processedAt: income.processedAt,
      auxId: income.auxId?.value,
    };
  }

  public static toDomain(raw: any): ProcessedIncomes {
    const YearOrError = Year.create({ year: raw.year });
    YearOrError.isFailure ? console.error(YearOrError.getErrorValue()) : '';
    
    const MonthOrError = Month.create({ month: raw.month });
    MonthOrError.isFailure ? console.error(MonthOrError.getErrorValue()) : '';

    const TotalIncomeProcessedOrError = Balance.create({ balance: raw.total_income_processed });
    TotalIncomeProcessedOrError.isFailure ? console.error(TotalIncomeProcessedOrError.getErrorValue()) : '';

    const UserIdOrError = Id.create(raw.user_id);
    UserIdOrError.isFailure ? console.error(UserIdOrError.getErrorValue()) : '';
    
    const AuxIdOrError = Id.create(raw.aux_id);
    AuxIdOrError.isFailure ? console.error(AuxIdOrError.getErrorValue()) : '';
    
    const debtOrError = ProcessedIncomes.create(
      {
        userId: UserIdOrError.getValue(),
        year: YearOrError.getValue(),
        month: MonthOrError.getValue(),
        totalIncomeProcessed: TotalIncomeProcessedOrError.getValue(),
        auxId: raw.aux_id ? AuxIdOrError.getValue() : undefined,
        processedAt: raw.processed_at,
        isReprocessed: raw.is_reprocessed,
        isSplitted: raw.is_splitted,
      }, new UniqueEntityID(raw.id));

    debtOrError.isFailure ? console.error(debtOrError.getErrorValue()) : '';

    return debtOrError.getValue();
  }

  public static async toPersistence(processdIncome: ProcessedIncomes): Promise<any> {
    return {
      id: processdIncome.id.toString(),
      user_id: processdIncome.userId.value,
      month: processdIncome.month.value,
      year: processdIncome.year.value,
      total_income_processed: processdIncome.totalIncomeProcessed.value,
      processed_at: processdIncome.processedAt,
      is_reprocessed: processdIncome.isReprocessed,
      is_splitted: processdIncome.isSplitted,
    };
  }
}
