
import { Transaction } from "../../entities/transaction/Transaction";
import { TransactionStatus } from "../../entities/transaction/TransactionStatus";
import { ICRUD } from "../ICRUD";

export interface Interface extends ICRUD<Transaction> {
    getAllByEnvelope(id: string, envelope: string, page?: number, pageSize?: number, orderBy?: string, order?: string): Promise<Transaction[]>
    updateStatus(id: string, status: TransactionStatus): Promise<boolean>
}
