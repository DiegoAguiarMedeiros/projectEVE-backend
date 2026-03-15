import { getAnalyticsCurrentEnvelopesController } from "../../../use-cases/get-analytics-current-envelopes";
import { getAnalyticsEnvelopesByYearController } from "../../../use-cases/get-analytics-envelopes-by-year";
import { getAnalyticsEnvelopesMonthOverviewController } from "../../../use-cases/get-analytics-envelopes-month-overview";
import { getGoalsCumulativeAmountController } from "../../../use-cases/get-goals-cumulative-amount";

const transactionController = {
    getAnalyticsCurrentEnvelopes: getAnalyticsCurrentEnvelopesController,
    getAnalyticsEnvelopesMonthOverview: getAnalyticsEnvelopesMonthOverviewController,
    getAnalyticsEnvelopesByYear: getAnalyticsEnvelopesByYearController,
    getGoalsCumulativeAmount: getGoalsCumulativeAmountController,
}

export default transactionController;