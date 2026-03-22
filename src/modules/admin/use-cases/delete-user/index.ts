import { DeleteAdminUserUseCase } from './DeleteAdminUserUseCase';
import { DeleteAdminUserController } from './DeleteAdminUserController';
import { userRepo } from '../../../users/repos/implementation';

const deleteAdminUserUseCase = new DeleteAdminUserUseCase(userRepo);
const deleteAdminUserController = new DeleteAdminUserController(deleteAdminUserUseCase);

export { deleteAdminUserController };
