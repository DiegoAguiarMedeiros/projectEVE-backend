import { GetAllAdminUsersUseCase } from './GetAllAdminUsersUseCase';
import { GetAllAdminUsersController } from './GetAllAdminUsersController';
import { userRepo } from '../../../users/repos/implementation';

const getAllAdminUsersUseCase = new GetAllAdminUsersUseCase(userRepo);
const getAllAdminUsersController = new GetAllAdminUsersController(getAllAdminUsersUseCase);

export { getAllAdminUsersController };
