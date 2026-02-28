import { VerifyEmailController } from "./VerifyEmailController";
import { VerifyEmailUseCase } from "./VerifyEmailUseCase";
import { userRepo } from "../../repos/implementation";

const verifyEmailUseCase = new VerifyEmailUseCase(userRepo);
const verifyEmailController = new VerifyEmailController(verifyEmailUseCase);

export { verifyEmailController };
