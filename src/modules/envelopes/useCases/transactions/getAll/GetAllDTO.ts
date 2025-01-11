import { Debt } from "../../../domain/debt";
import { Transaction } from "../../../domain/transaction";

export interface GetAllDTO {
    transaction: Transaction[];
}