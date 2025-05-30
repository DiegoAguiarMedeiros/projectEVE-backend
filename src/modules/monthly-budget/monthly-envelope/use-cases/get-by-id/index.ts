import { GetByIdUseCase } from "./GetByIdUseCase";
import { GetByIdController } from './GetByIdController';
import { monthlyEnvelopeRepo } from "../../repos/implementation";

const getByIdUseCase = new GetByIdUseCase(monthlyEnvelopeRepo);
const getByIdController = new GetByIdController(getByIdUseCase);

export { getByIdController }