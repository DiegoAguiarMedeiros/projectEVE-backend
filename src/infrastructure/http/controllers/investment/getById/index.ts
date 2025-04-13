import { GetByIdUseCase } from '../../../../../application/useCases/investment/getById/GetByIdUseCase';
import { investmentRepo } from '../../../../../domain/repositories';
import { GetByIdController } from './GetByIdController';

const getByIdUseCase = new GetByIdUseCase(investmentRepo);
const getByIdController = new GetByIdController(getByIdUseCase);

export { getByIdController }