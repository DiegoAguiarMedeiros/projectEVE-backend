import { GetAdminUserByIdUseCase } from './GetAdminUserByIdUseCase';
import { GetAdminUserByIdController } from './GetAdminUserByIdController';
import { userRepo } from '../../../users/repos/implementation';

const getAdminUserByIdUseCase = new GetAdminUserByIdUseCase(userRepo);
const getAdminUserByIdController = new GetAdminUserByIdController(getAdminUserByIdUseCase);

export { getAdminUserByIdController };
