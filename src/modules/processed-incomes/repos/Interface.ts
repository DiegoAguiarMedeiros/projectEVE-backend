
import { ICRUD } from "../../../shared/domain/repos/ICRUD";
import { ProcessedIncomes } from "../domain";
import { YearMonths, ToalByYearMonths } from "../dtos";



export interface Interface extends ICRUD<ProcessedIncomes> {
    getProcessedMonth(userId: string): Promise<YearMonths>;
    getOnlyById(id: string): Promise<ProcessedIncomes | null>
    getTotalbyMonth(year: number, month: number, userId: string): Promise<ToalByYearMonths>;
    getAllByYearMonth(id: string,year: number, month: number, page?: number, pageSize?: number, orderBy?: string, order?: string): Promise<ProcessedIncomes[]>
}
