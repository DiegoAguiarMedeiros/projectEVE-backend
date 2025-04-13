import { GetAllUseCase } from "../../../../../application/useCases/envelope/getAll/GetAllUseCase";
import { envelopeRepo } from "../../../../../domain/repositories";
import { GetAllController } from "./GetAllController";

const getAllUseCase = new GetAllUseCase(envelopeRepo);
const getAllController = new GetAllController(getAllUseCase);

export { getAllController }