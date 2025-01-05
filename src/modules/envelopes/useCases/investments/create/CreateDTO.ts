import { InvestmentsStatus } from "../../../domain/investmentsStatus";
import { InvestmentsType } from "../../../domain/investmentsType";

export interface CreateDTO {
  userId: string;
  description: string;
  type: InvestmentsType;
  amount: number;
  applicationDate: Date;
  maturityDate: Date;
  status: InvestmentsStatus;
}
