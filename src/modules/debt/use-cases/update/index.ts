
import { UpdateUseCase } from "./UpdateUseCase";
import { UpdateController } from "./UpdateController";
import { debtRepo } from "../../repos/implementation";


const updatedUseCase = new UpdateUseCase(debtRepo);
const updateController = new UpdateController(updatedUseCase);

export { updateController }