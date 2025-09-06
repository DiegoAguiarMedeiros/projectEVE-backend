
import { transactionRepo } from "../../../transactions/repos/implementation";
import { GetAnalyticsEnvelopesByYearController } from "./GetAnalyticsEnvelopesByYearController";
import { GetAnalyticsEnvelopesByYearUseCase } from "./GetAnalyticsEnvelopesByYearUseCase";

const getAnalyticsEnvelopesByYearUseCase = new GetAnalyticsEnvelopesByYearUseCase(transactionRepo);
const getAnalyticsEnvelopesByYearController = new GetAnalyticsEnvelopesByYearController(getAnalyticsEnvelopesByYearUseCase);

export { getAnalyticsEnvelopesByYearController }