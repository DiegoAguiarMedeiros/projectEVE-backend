import { InvestmentsStatus } from "../../../domain/investmentsStatus";
import { InvestmentsType } from "../../../domain/investmentsType";

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
