
import { Pagination } from "../../../../shared/domain/Pagination";
import { Interface as IProcessedIncomesRepo } from "../../repos/Interface";
import { left, right, Result } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { GetTotalResponse } from "./GetTotalResponse";
import { ProcessedIncomes } from "../../domain";
import { ToalByYearMonths } from "../../dtos";


export class GetTotalUseCase implements UseCase<{ userId: string, year: number, month: number }, Promise<GetTotalResponse>> {
    private repo: IProcessedIncomesRepo;

    constructor(repo: IProcessedIncomesRepo) {
        this.repo = repo;
    }
    async execute({ userId, year, month }: { userId: string, year: number, month: number }): Promise<GetTotalResponse> {
        const Total = await this.repo.getTotalbyMonth(year, month, userId);
        return right(Result.ok<ToalByYearMonths>(Total));
    }

}