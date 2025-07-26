
import { ICRUD } from "../../../shared/domain/repos/ICRUD";
import { ProcessedIncomes } from "../domain";
import { YearMonths } from "../dtos";



export interface Interface extends ICRUD<ProcessedIncomes> {
    getProcessedMonth(userId: string): Promise<YearMonths>;
    getOnlyById(id: string): Promise<ProcessedIncomes | null>
}
