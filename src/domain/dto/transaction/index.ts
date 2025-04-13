import { PaymentMethod } from "../../entities/transaction/PaymentMethod";
import { TransactionsStatus } from "../../entities/transaction/TransactionsStatus";
import { TransactionsType } from "../../entities/transaction/TransactionsType";


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