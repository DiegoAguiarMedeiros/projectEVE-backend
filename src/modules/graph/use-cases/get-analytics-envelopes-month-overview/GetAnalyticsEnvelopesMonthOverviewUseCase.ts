import { Interface as IProcessedIncomesRepo } from "../../../processed-incomes/repos/Interface";
import { Interface as IEnvelopesRepo } from "../../../envelopes/repos/Interface";
import { Interface as ITransactionsRepo } from "../../../transactions/repos/Interface";
import { Result, right } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { GetAnalyticsEnvelopesMonthOverviewResponse } from "./GetAnalyticsEnvelopesMonthOverviewResponse";
import { AnalyticsEnvelopesMonthOverviewDTO } from "../../dtos";
import { MONTHS } from "../../../../shared/constants/months";


export class GetAnalyticsEnvelopesMonthOverviewUseCase implements UseCase<{ id: string; year: number, month: number }, Promise<GetAnalyticsEnvelopesMonthOverviewResponse>> {
    private transactionsRepo: ITransactionsRepo;

    constructor(transactionsRepo: ITransactionsRepo) {
        this.transactionsRepo = transactionsRepo;
    }
    async execute({ id, year, month }: { id: string, year: number, month: number }): Promise<GetAnalyticsEnvelopesMonthOverviewResponse> {

        const incomeData = await this.transactionsRepo.getIncomesMonthOverview(year, month, id);
        const goalsData = await this.transactionsRepo.getGoalsMonthOverview(year, month, id);
        const expensesData = await this.transactionsRepo.getExpensesMonthOverview(year, month, id);

        const chartData: AnalyticsEnvelopesMonthOverviewDTO[] = [
            {
                title: 'incomes',
                total: incomeData ?? 0,
                icon: 'CallMadeIcon',
                color: 'primary'
            },
            {
                title: 'goals',
                total: goalsData ?? 0,
                icon: 'SavingsIcon',
                color: 'info'
            },
            {
                title: 'expenses',
                total: expensesData ?? 0,
                icon: 'SouthEastIcon',
                color: 'error'
            },
            {
                title: 'balance',
                total: incomeData - expensesData - goalsData,
                icon: 'AttachMoneyIcon',
                color: 'success'
            },
        ]


        return right(Result.ok<AnalyticsEnvelopesMonthOverviewDTO[]>(chartData));
    }

}