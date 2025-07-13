
import { debtRepo } from "../../repos/implementation";
import { GetAllController } from "./GetAllController";
import { GetAllUseCase } from "./GetAllUseCase";

const getAllUseCase = new GetAllUseCase(debtRepo);
const getAllController = new GetAllController(getAllUseCase);

export { getAllController }