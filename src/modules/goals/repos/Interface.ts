
import { Goals } from "../domain/Goals";
import { ICRUD } from "../../../shared/domain/repos/ICRUD";

export interface Interface extends ICRUD<Goals> {
    countAll?(userId: string): Promise<number>;
    deleteAll(ids: string[], userId: string): Promise<number>;
}
