import { DeleteUseCase } from "./DeleteUseCase";
import { DeleteController } from './DeleteController'
import { debtRepo } from "../../repos/implementation";

const deleteUseCase = new DeleteUseCase(debtRepo);
const deleteController = new DeleteController(deleteUseCase);

export { deleteController }