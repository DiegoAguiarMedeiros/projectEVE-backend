import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";
import { DebtsStatus } from "../../../domain/debtsStatus";
import { Flags } from "../../../domain/flags";

export interface CreateDTO {
  userId: string;
  description: string;
  amount: number;
  paymentDate: Date;
}