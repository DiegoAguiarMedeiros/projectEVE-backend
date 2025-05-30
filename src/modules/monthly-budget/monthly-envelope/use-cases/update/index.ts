
import { monthlyEnvelopeRepo } from "../../repos/implementation";
import { UpdateController } from "./UpdateController";
import { UpdateUseCase } from "./UpdateUseCase";


const updateUseCase = new UpdateUseCase(monthlyEnvelopeRepo);
const updateController = new UpdateController(updateUseCase);

export { updateController }