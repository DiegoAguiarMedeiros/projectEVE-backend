
import { monthlyEnvelopeRepo } from "../../repos/implementation";
import { GetAllController } from "./GetAllController";
import { GetAllUseCase } from "./GetAllUseCase";

const getAllUseCase = new GetAllUseCase(monthlyEnvelopeRepo);
const getAllController = new GetAllController(getAllUseCase);

export { getAllController }