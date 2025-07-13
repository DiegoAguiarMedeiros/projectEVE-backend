import { UpdateUseCase } from "./UpdateUseCase";
import { UpdateController } from './UpdateController'
import { creditCardRepo } from "../../repos/implementation";

const updateUseCase = new UpdateUseCase(creditCardRepo);
const updateController = new UpdateController(updateUseCase);

export { updateController }