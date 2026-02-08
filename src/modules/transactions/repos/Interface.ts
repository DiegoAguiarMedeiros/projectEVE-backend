
import { ICRUD } from "../../../shared/domain/repos/ICRUD";
import { Transactions, TransactionsStatus, TransactionsType } from "../domain";

export interface Interface extends ICRUD<Transactions> {
    getAllByEnvelope(id: string, envelope: string, year: number, month: number, page?: number, pageSize?: number, orderBy?: string, order?: string, type?: TransactionsType): Promise<Transactions[]>
    getAllByProcessedIncomesId(processedIncomesId: string): Promise<Transactions[]>
    updateStatus(id: string, status: TransactionsStatus): Promise<boolean>;
    getIncomesMonthOverview(year: number, month: number, userId: string): Promise<number>;
    getGoalsMonthOverview(year: number, month: number, userId: string): Promise<number>;
    getExpensesMonthOverview(year: number, month: number, userId: string): Promise<number>;
    getIncomesByYear(year: number, userId: string): Promise<number[]>;
    getGoalsByYear(year: number, userId: string): Promise<number[]>;
    getExpensesByYear(year: number, userId: string): Promise<number[]>;
    getUpcomingPendingTransaction(userId: string, page?: number, pageSize?: number, orderBy?: string, order?: string): Promise<Transactions[]>;
}
