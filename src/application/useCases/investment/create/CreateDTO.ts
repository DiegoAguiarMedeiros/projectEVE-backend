import { InvestmentsStatus } from "../../../../domain/entities/investment/InvestmentsStatus";
import { InvestmentsType } from "../../../../domain/entities/investment/InvestmentsType";

export interface CreateDTO {
  userId: string;
  envelopeId: string;
  description: string;
  type: InvestmentsType;
  amount: number;
  profitability: number;
  applicationDate: Date;
  maturityDate: Date;
  status: InvestmentsStatus;
}
