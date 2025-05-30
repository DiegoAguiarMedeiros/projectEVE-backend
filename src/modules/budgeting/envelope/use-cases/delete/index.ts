import { DeleteUseCase } from "./DeleteUseCase";
import { DeleteController } from './DeleteController';
import { envelopeRepo } from "../../repos/implementation";

const deleteUseCase = new DeleteUseCase(envelopeRepo);
const deleteController = new DeleteController(deleteUseCase);

export { deleteController }