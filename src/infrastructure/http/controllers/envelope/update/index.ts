import { UpdateUseCase } from "../../../../../application/useCases/envelope/update/UpdateUseCase";
import { envelopeRepo } from "../../../../../domain/repositories";
import { UpdateController } from "./UpdateController";


const updateUseCase = new UpdateUseCase(envelopeRepo);
const updateController = new UpdateController(updateUseCase);

export { updateController }