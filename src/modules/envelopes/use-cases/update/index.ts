import { UpdateUseCase } from "./UpdateUseCase";
import { UpdateController } from "./UpdateController";
import { envelopeRepo } from "../../repos/implementation";
import { fixedExpenseRepo } from "../../../fixed-expenses/repos/implementation";
import { incomeRepo } from "../../../incomes/repos/implementation";


const updateUseCase = new UpdateUseCase(envelopeRepo, fixedExpenseRepo, incomeRepo);
const updateController = new UpdateController(updateUseCase);

export { updateController }