import { getAnalyticsCurrentEnvelopesController } from "../../../use-cases/get-analytics-current-envelopes";
import { getAnalyticsEnvelopesByYearController } from "../../../use-cases/get-analytics-envelopes-by-year";
import { getAnalyticsEnvelopesMonthOverviewController } from "../../../use-cases/get-analytics-envelopes-month-overview";

const transactionController = {
    getAnalyticsCurrentEnvelopes: getAnalyticsCurrentEnvelopesController,
    getAnalyticsEnvelopesMonthOverview: getAnalyticsEnvelopesMonthOverviewController,
    getAnalyticsEnvelopesByYear: getAnalyticsEnvelopesByYearController,
}

export default transactionController;