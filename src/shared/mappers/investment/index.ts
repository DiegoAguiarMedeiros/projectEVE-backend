import { InvestmentsDTO } from "../../../domain/dto/investment";
import { Investment } from "../../../domain/entities/investment/Investment";
import { InvestmentsStatus } from "../../../domain/entities/investment/InvestmentsStatus";
import { InvestmentsType } from "../../../domain/entities/investment/InvestmentsType";
import { Balance } from "../../../domain/shared/Balance";
import { Description } from "../../../domain/shared/Description";
import { Id } from "../../../domain/shared/Id";
import { Mapper } from "../Mapper";


export class InvestmentsMap implements Mapper<Investment> {
  public static toDTO(investment: Investment): InvestmentsDTO {
    return {
      id: investment.id.value,
      envelopeId: investment.envelopeId.value,
      description: investment.description.value,
      amount: investment.amount.value,
      profitability: investment.profitability.value,
      applicationDate: investment.applicationDate,
      maturityDate: investment.maturityDate,
      type: investment.type,
      status: investment.status,
    };
  }

  public static toDomain(raw: any): Investment {

    const DescriptionOrError = Description.create({ description: raw.description });
    DescriptionOrError.isFailure ? console.error(DescriptionOrError.getErrorValue()) : '';

    const AmountOrError = Balance.create({ balance: raw.amount });
    AmountOrError.isFailure ? console.error(AmountOrError.getErrorValue()) : '';
    
    const ProfitabilityOrError = Balance.create({ balance: raw.profitability });
    ProfitabilityOrError.isFailure ? console.error(ProfitabilityOrError.getErrorValue()) : '';

    const EnvelopeIdOrError = Id.create(raw.envelope_id);
    EnvelopeIdOrError.isFailure ? console.error(EnvelopeIdOrError.getErrorValue()) : '';

    const IdOrError = Id.create(raw.id);
    IdOrError.isFailure ? console.error(IdOrError.getErrorValue()) : '';
    const applicationDate: Date = raw.application_date;
    const maturityDate: Date = raw.maturity_date;
    const status: InvestmentsStatus = raw.status;
    const type: InvestmentsType = raw.type;

    const investmentOrError = Investment.create(
      {
        id: IdOrError.getValue(),
        envelopeId: EnvelopeIdOrError.getValue(),
        description: DescriptionOrError.getValue(),
        amount: AmountOrError.getValue(),
        profitability:ProfitabilityOrError.getValue(),
        applicationDate: applicationDate,
        maturityDate: maturityDate,
        type: type,
        status: status,
      }
    );

    investmentOrError.isFailure ? console.error(investmentOrError.getErrorValue()) : '';

    return investmentOrError.getValue();
  }

  public static async toPersistence(investment: Investment): Promise<any> {

    return {
      id: investment.id.value,
      envelope_id: investment.envelopeId.value,
      description: investment.description.value,
      amount: investment.amount.value,
      profitability: investment.profitability.value,
      application_date: investment.applicationDate,
      maturity_date: investment.maturityDate,
      type: investment.type,
      status: investment.status,
    };
  }
}
