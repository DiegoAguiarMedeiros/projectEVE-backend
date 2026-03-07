
import { Goals } from "../domain/Goals";
import { ICRUD } from "../../../shared/domain/repos/ICRUD";

export interface Interface extends ICRUD<Goals> {
    deleteAll(ids: string[], userId: string): Promise<number>;
}
