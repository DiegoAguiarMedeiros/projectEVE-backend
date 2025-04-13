import { DebtsStatus } from "../../../../domain/entities/debt/DebtsStatus";

export interface CreateDTO {
  userId: string;
  creditCardId?: string;
  description: string;
  amount: number;
  installments_total: number;
  installments_paid: number;
  dueDate: Date;
  status: DebtsStatus;
}