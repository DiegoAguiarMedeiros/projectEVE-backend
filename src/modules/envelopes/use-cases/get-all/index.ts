import { GetAllUseCase } from "./GetAllUseCase";
import { GetAllController } from "./GetAllController";
import { envelopeRepo } from "../../repos/implementation";

const getAllUseCase = new GetAllUseCase(envelopeRepo);
const getAllController = new GetAllController(getAllUseCase);

export { getAllController }