import { GetByIdUseCase } from '../../../../../application/useCases/income/getById/GetByIdUseCase';
import { incomeRepo } from '../../../../../domain/repositories';
import { GetByIdController } from './GetByIdController';

const getByIdUseCase = new GetByIdUseCase(incomeRepo);
const getByIdController = new GetByIdController(getByIdUseCase);

export { getByIdController }