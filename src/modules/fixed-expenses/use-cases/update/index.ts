import { UpdateUseCase } from "./UpdateUseCase";
import { UpdateController } from "./UpdateController";
import { envelopeRepo } from "../../../envelopes/repos/implementation";
import { fixedExpenseRepo } from "../../repos/implementation";

const updatedUseCase = new UpdateUseCase(fixedExpenseRepo,envelopeRepo);
const updateController = new UpdateController(updatedUseCase);

export { updateController }