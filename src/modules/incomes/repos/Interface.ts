
import { ICRUD } from "../../../shared/domain/repos/ICRUD";
import { Incomes } from "../domain";



export interface Interface extends ICRUD<Incomes> {
    getTotal(userId: string): Promise<number>;
}
