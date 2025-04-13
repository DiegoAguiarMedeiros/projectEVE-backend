import { Transaction } from "../../../../domain/entities/transaction/Transaction";

export interface GetAllDTO {
    transaction: Transaction[];
}