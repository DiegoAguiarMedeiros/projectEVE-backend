
import { ICRUD } from "../../../shared/domain/repos/ICRUD";
import { Transactions, TransactionsStatus } from "../domain";

export interface Interface extends ICRUD<Transactions> {
    getAllByEnvelope(id: string, envelope: string, page?: number, pageSize?: number, orderBy?: string, order?: string): Promise<Transactions[]>
    updateStatus(id: string, status: TransactionsStatus): Promise<boolean>
}
