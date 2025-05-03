import { UpdateUseCase } from '../../../../../application/useCases/fixedExpense/update/UpdateUseCase';
import { fixedExpenseRepo, envelopeRepo } from "../../../../../domain/repositories";
import { UpdateController } from './UpdateController';

const updatedUseCase = new UpdateUseCase(fixedExpenseRepo,envelopeRepo);
const updateController = new UpdateController(updatedUseCase);

export { updateController }