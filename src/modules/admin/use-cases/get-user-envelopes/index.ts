import { GetUserEnvelopesAdminUseCase } from './GetUserEnvelopesAdminUseCase';
import { GetUserEnvelopesAdminController } from './GetUserEnvelopesAdminController';

const getUserEnvelopesAdminUseCase = new GetUserEnvelopesAdminUseCase();
const getUserEnvelopesAdminController = new GetUserEnvelopesAdminController(getUserEnvelopesAdminUseCase);

export { getUserEnvelopesAdminController };
