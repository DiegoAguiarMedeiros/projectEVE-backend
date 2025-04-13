import { UpdateUseCase } from "../../../../../application/useCases/debt/update/UpdateUseCase";
import { debtRepo } from "../../../../../domain/repositories";
import { UpdateController } from "./UpdateController";


const updatedUseCase = new UpdateUseCase(debtRepo);
const updateController = new UpdateController(updatedUseCase);

export { updateController }