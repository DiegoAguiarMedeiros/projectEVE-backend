import { DeleteAdminUserUseCase } from './DeleteAdminUserUseCase';
import { DeleteAdminUserController } from './DeleteAdminUserController';
import { userRepo } from '../../../users/repos/implementation';
import { authService } from '../../../../shared/infrastructure/services';

const deleteAdminUserUseCase = new DeleteAdminUserUseCase(userRepo, authService);
const deleteAdminUserController = new DeleteAdminUserController(deleteAdminUserUseCase);

export { deleteAdminUserController };
