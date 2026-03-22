import { UpdateBaseEnvelopeAdminUseCase } from './UpdateBaseEnvelopeAdminUseCase';
import { UpdateBaseEnvelopeAdminController } from './UpdateBaseEnvelopeAdminController';
import { baseEnvelopeRepo } from '../../../base-envelope/repos/implementation';

const updateBaseEnvelopeAdminUseCase = new UpdateBaseEnvelopeAdminUseCase(baseEnvelopeRepo);
const updateBaseEnvelopeAdminController = new UpdateBaseEnvelopeAdminController(updateBaseEnvelopeAdminUseCase);

export { updateBaseEnvelopeAdminController };
