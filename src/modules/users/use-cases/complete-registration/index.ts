import { CompleteRegistrationUseCase } from "./CompleteRegistrationUseCase";
import { CompleteRegistrationController } from "./CompleteRegistrationController";
import { userRepo } from "../../repos/implementation";

const completeRegistrationUseCase = new CompleteRegistrationUseCase(userRepo);
const completeRegistrationController = new CompleteRegistrationController(completeRegistrationUseCase);

export {
    completeRegistrationUseCase,
    completeRegistrationController
}
