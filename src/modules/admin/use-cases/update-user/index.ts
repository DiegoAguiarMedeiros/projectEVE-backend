import { UpdateAdminUserUseCase } from './UpdateAdminUserUseCase';
import { UpdateAdminUserController } from './UpdateAdminUserController';

const updateAdminUserUseCase = new UpdateAdminUserUseCase();
const updateAdminUserController = new UpdateAdminUserController(updateAdminUserUseCase);

export { updateAdminUserController };
