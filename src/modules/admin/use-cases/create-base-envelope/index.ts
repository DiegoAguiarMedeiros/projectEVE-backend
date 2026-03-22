import { CreateBaseEnvelopeAdminUseCase } from './CreateBaseEnvelopeAdminUseCase';
import { CreateBaseEnvelopeAdminController } from './CreateBaseEnvelopeAdminController';
import { baseEnvelopeRepo } from '../../../base-envelope/repos/implementation';

const createBaseEnvelopeAdminUseCase = new CreateBaseEnvelopeAdminUseCase(baseEnvelopeRepo);
const createBaseEnvelopeAdminController = new CreateBaseEnvelopeAdminController(createBaseEnvelopeAdminUseCase);

export { createBaseEnvelopeAdminController };
