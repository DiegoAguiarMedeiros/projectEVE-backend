import { GetAllBaseEnvelopesAdminUseCase } from './GetAllBaseEnvelopesAdminUseCase';
import { GetAllBaseEnvelopesAdminController } from './GetAllBaseEnvelopesAdminController';
import { baseEnvelopeRepo } from '../../../base-envelope/repos/implementation';

const getAllBaseEnvelopesAdminUseCase = new GetAllBaseEnvelopesAdminUseCase(baseEnvelopeRepo);
const getAllBaseEnvelopesAdminController = new GetAllBaseEnvelopesAdminController(getAllBaseEnvelopesAdminUseCase);

export { getAllBaseEnvelopesAdminController };
