import { GetByIdController } from "./GetByIdController";
import { userRepo } from "../../repos/implementation";

const getByIdController = new GetByIdController(userRepo);

export { getByIdController }