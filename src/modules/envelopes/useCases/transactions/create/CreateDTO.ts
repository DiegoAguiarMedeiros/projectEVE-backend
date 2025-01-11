import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";
import { DebtsStatus } from "../../../domain/debtsStatus";
import { Flags } from "../../../domain/flags";
import { PaymentMethod } from "../../../domain/paymentMethod";
import { TransactionsStatus } from "../../../domain/transactionsStatus";
import { TransactionsType } from "../../../domain/transactionsType";

export interface CreateDTO {
  userId: string;
  creditCardId?: string;
  envelopeId: string;
  description: string;
  amount: number;
  paymentMethod: PaymentMethod;
  date: Date;
  type: TransactionsType;
  status: TransactionsStatus;
}