import { GetByIdUseCase } from '../../../../../application/useCases/debt/getById/GetByIdUseCase';
import { debtRepo } from '../../../../../domain/repositories';
import { GetByIdController } from './GetByIdController'

const getByIdUseCase = new GetByIdUseCase(debtRepo);
const getByIdController = new GetByIdController(getByIdUseCase);

export { getByIdController }