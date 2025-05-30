
import { ICRUD } from "../../../../shared/domain/repos/ICRUD";
import { Transaction, TransactionStatus } from "../domain";

export interface Interface extends ICRUD<Transaction> {
    getAllByEnvelope(id: string, envelope: string, page?: number, pageSize?: number, orderBy?: string, order?: string): Promise<Transaction[]>
    updateStatus(id: string, status: TransactionStatus): Promise<boolean>
}
