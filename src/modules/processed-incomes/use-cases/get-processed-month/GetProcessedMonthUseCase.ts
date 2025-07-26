
import { Pagination } from "../../../../shared/domain/Pagination";
import { Interface as IProcessedIncomesRepo } from "../../repos/Interface";
import { left, right, Result } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { GetProcessedMonthResponse } from "./GetProcessedMonthResponse";
import { ProcessedIncomes } from "../../domain";
import { YearMonths } from "../../dtos";


export class GetProcessedMonthUseCase implements UseCase<{ userId: string; }, Promise<GetProcessedMonthResponse>> {
    private repo: IProcessedIncomesRepo;

    constructor(repo: IProcessedIncomesRepo) {
        this.repo = repo;
    }
    async execute({ userId }: { userId: string; }): Promise<GetProcessedMonthResponse> {
        const processedMonth = await this.repo.getProcessedMonth(userId);
        console.log("processedMonth",processedMonth)
        return right(Result.ok<YearMonths>(processedMonth));
    }

}