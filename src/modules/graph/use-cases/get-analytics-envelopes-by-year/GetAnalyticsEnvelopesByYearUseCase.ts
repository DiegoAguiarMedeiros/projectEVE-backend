import { Interface as IProcessedIncomesRepo } from "../../../processed-incomes/repos/Interface";
import { Interface as IEnvelopesRepo } from "../../../envelopes/repos/Interface";
import { Interface as ITransactionsRepo } from "../../../transactions/repos/Interface";
import { Result, right } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { GetAnalyticsEnvelopesByYearResponse } from "./GetAnalyticsEnvelopesByYearResponse";
import { AnalyticsEnvelopesByYearDTO } from "../../dtos";
import { MONTHS } from "../../../../shared/constants/months";


export class GetAnalyticsEnvelopesByYearUseCase implements UseCase<{ id: string; year: number }, Promise<GetAnalyticsEnvelopesByYearResponse>> {
    private transactionsRepo: ITransactionsRepo;

    constructor(transactionsRepo: ITransactionsRepo) {
        this.transactionsRepo = transactionsRepo;
    }
    async execute({ id, year }: { id: string, year: number }): Promise<GetAnalyticsEnvelopesByYearResponse> {

        const incomeData = await this.transactionsRepo.getIncomesByYear(year, id);
        const goalsData = await this.transactionsRepo.getGoalsByYear(year, id);
        const expensesData = await this.transactionsRepo.getExpensesByYear(year, id);

        const chartData: AnalyticsEnvelopesByYearDTO = {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Out", "Nov", "Dez"],
            series: [
                { name: "incomes", data: incomeData ?? 0 },
                { name: "goals", data: goalsData ?? 0 },
                { name: "expenses", data: expensesData ?? 0 },
                { name: "balance", data: MONTHS.map((_, index) => (incomeData[index] - expensesData[index] - goalsData[index])) },
            ],
        };


        return right(Result.ok<AnalyticsEnvelopesByYearDTO>(chartData));
    }

}