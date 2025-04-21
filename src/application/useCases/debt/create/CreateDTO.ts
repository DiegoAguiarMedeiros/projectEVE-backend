import { DebtsStatus } from "../../../../domain/entities/debt/DebtsStatus";

export interface CreateDTO {
  userId: string;
  description: string;
  amount: number;
  installmentsTotal: number;
  installmentsPaid: number;
  paymentDay: number;
  status: DebtsStatus;
}