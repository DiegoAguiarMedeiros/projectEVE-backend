import { PaymentMethod } from "../../../../domain/entities/transaction/PaymentMethod";
import { TransactionsStatus } from "../../../../domain/entities/transaction/TransactionsStatus";
import { TransactionsType } from "../../../../domain/entities/transaction/TransactionsType";

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