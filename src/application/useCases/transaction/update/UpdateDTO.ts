import { PaymentMethod } from "../../../../domain/entities/transaction/PaymentMethod";
import { TransactionsStatus } from "../../../../domain/entities/transaction/TransactionsStatus";
import { TransactionsType } from "../../../../domain/entities/transaction/TransactionsType";
import { UniqueEntityID } from "../../../../domain/shared/UniqueEntityID";

export interface UpdateDTO {
    id: UniqueEntityID;
    userId: UniqueEntityID;
    creditCardId?: string;
    envelopeId?: string;
    description?: string;
    amount?: number;
    paymentMethod?: PaymentMethod;
    date?: Date;
    type?: TransactionsType;
    status?: TransactionsStatus;
}