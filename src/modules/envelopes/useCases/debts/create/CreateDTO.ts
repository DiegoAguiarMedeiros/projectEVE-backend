import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";
import { DebtsStatus } from "../../../domain/debtsStatus";
import { Flags } from "../../../domain/flags";

export interface CreateDTO {
  userId: string;
  creditCardId?: string;
  envelopeId: string;
  description: string;
  amount: number;
  installments_total: number;
  installments_paid: number;
  dueDate: Date;
  status: DebtsStatus;
}