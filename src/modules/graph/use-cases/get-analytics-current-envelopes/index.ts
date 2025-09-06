
import { envelopeRepo } from "../../../envelopes/repos/implementation";
import { GetAnalyticsCurrentEnvelopesController } from "./GetAnalyticsCurrentEnvelopesController";
import { GetAnalyticsCurrentEnvelopesUseCase } from "./GetAnalyticsCurrentEnvelopesUseCase";

const getAnalyticsCurrentEnvelopesUseCase = new GetAnalyticsCurrentEnvelopesUseCase(envelopeRepo);
const getAnalyticsCurrentEnvelopesController = new GetAnalyticsCurrentEnvelopesController(getAnalyticsCurrentEnvelopesUseCase);

export { getAnalyticsCurrentEnvelopesController }