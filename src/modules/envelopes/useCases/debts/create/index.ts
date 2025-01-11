
import { CreateUseCase } from "./CreateUseCase";
import { CreateController } from "./CreateController";
import { debtRepo } from "../../../repos";
import { getEnvelopeByIdUseCase } from "../../envelopes/getById";

const createDebtUseCase = new CreateUseCase(debtRepo,getEnvelopeByIdUseCase);
const createDebtController = new CreateController(
    createDebtUseCase
)

export {
    createDebtUseCase,
    createDebtController
}