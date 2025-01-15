
import { CreateUseCase } from "./CreateUseCase";
import { CreateController } from "./CreateController";
import { debtRepo ,envelopeRepo} from "../../../repos";
import { getEnvelopeByIdUseCase } from "../../envelopes/getById";

const createDebtUseCase = new CreateUseCase(debtRepo,envelopeRepo);
const createDebtController = new CreateController(
    createDebtUseCase
)

export {
    createDebtUseCase,
    createDebtController
}