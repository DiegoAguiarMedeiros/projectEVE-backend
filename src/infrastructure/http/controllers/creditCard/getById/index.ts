import { GetByIdUseCase } from '../../../../../application/useCases/creditCard/getById/GetByIdUseCase';
import { creditCardRepo } from '../../../../../domain/repositories';
import { GetByIdController } from './GetByIdController';

const getByIdUseCase = new GetByIdUseCase(creditCardRepo);
const getByIdController = new GetByIdController(getByIdUseCase);

export { getByIdController }