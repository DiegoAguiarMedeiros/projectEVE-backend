
import { transactionRepo } from "../../../transactions/repos/implementation";
import { GetAnalyticsEnvelopesMonthOverviewController } from "./GetAnalyticsEnvelopesMonthOverviewController";
import { GetAnalyticsEnvelopesMonthOverviewUseCase } from "./GetAnalyticsEnvelopesMonthOverviewUseCase";

const getAnalyticsEnvelopesMonthOverviewUseCase = new GetAnalyticsEnvelopesMonthOverviewUseCase(transactionRepo);
const getAnalyticsEnvelopesMonthOverviewController = new GetAnalyticsEnvelopesMonthOverviewController(getAnalyticsEnvelopesMonthOverviewUseCase);

export { getAnalyticsEnvelopesMonthOverviewController }