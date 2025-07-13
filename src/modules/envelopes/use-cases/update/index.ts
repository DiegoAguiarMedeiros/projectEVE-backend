import { UpdateUseCase } from "./UpdateUseCase";
import { UpdateController } from "./UpdateController";
import { envelopeRepo } from "../../repos/implementation";


const updateUseCase = new UpdateUseCase(envelopeRepo);
const updateController = new UpdateController(updateUseCase);

export { updateController }