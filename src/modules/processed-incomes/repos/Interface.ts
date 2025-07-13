
import { ICRUD } from "../../../shared/domain/repos/ICRUD";
import { ProcessedIncomes } from "../domain";



export interface Interface extends ICRUD<ProcessedIncomes> {
    getTotalIncomeByUserId(userId: string): Promise<number>;
    getOnlyById(id: string): Promise<ProcessedIncomes | null>
}
