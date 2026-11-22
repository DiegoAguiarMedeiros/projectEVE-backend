import { ICRUD } from "../../../shared/domain/repos/ICRUD";
import { Debt } from "../domain";


export interface Interface extends ICRUD<Debt> {
    countAll?(userId: string): Promise<number>;
    getOnlyById(id: string): Promise<Debt | null>;
    getTotal(userId: string): Promise<number>;
    deleteAll(ids: string[], userId: string): Promise<number>;
    updateInstallmentsPaid(id: string, delta: number): Promise<void>;
}
