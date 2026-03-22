import { DeleteBaseEnvelopeAdminUseCase } from './DeleteBaseEnvelopeAdminUseCase';
import { DeleteBaseEnvelopeAdminController } from './DeleteBaseEnvelopeAdminController';
import { baseEnvelopeRepo } from '../../../base-envelope/repos/implementation';

const deleteBaseEnvelopeAdminUseCase = new DeleteBaseEnvelopeAdminUseCase(baseEnvelopeRepo);
const deleteBaseEnvelopeAdminController = new DeleteBaseEnvelopeAdminController(deleteBaseEnvelopeAdminUseCase);

export { deleteBaseEnvelopeAdminController };
