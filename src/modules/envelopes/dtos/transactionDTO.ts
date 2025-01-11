import { DebtsStatus } from "../domain/debtsStatus";
import { PaymentMethod } from "../domain/paymentMethod";
import { TransactionsStatus } from "../domain/transactionsStatus";
import { TransactionsType } from "../domain/transactionsType";

export interface TransactionDTO {
    id: string;
    creditCardId?: string;
    envelopeId: string;
    description: string;
    amount: number;
    paymentMethod: PaymentMethod;
    date: Date;
    type: TransactionsType;
    status: TransactionsStatus;
}