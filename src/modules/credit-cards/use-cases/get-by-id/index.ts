import { GetByIdUseCase } from "./GetByIdUseCase";
import { GetByIdController } from './GetByIdController';
import { creditCardRepo } from "../../repos/implementation";

const getByIdUseCase = new GetByIdUseCase(creditCardRepo);
const getByIdController = new GetByIdController(getByIdUseCase);

export { getByIdController }