import { UpdateUseCase } from "./UpdateUseCase";
import { UpdateController } from "./UpdateController";
import { envelopeRepo } from "../../../envelopes/repos/implementation";
import { goalsRepo } from "../../repos/implementation";

const updatedUseCase = new UpdateUseCase(goalsRepo,envelopeRepo);
const updateController = new UpdateController(updatedUseCase);

export { updateController }