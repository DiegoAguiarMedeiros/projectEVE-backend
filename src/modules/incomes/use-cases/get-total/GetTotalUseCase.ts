
import { Pagination } from "../../../../shared/domain/Pagination";
import { Interface as IIncomesRepo } from "../../repos/Interface";
import { left, Result, right } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { GetTotalResponse } from "./GetTotalResponse";


export class GetTotalUseCase implements UseCase<{ userId: string }, Promise<GetTotalResponse>> {
    private repo: IIncomesRepo;

    constructor(repo: IIncomesRepo) {
        this.repo = repo;
    }
    async execute({ userId }: { userId: string }): Promise<GetTotalResponse> {
        const totalIncomes = await this.repo.getTotalIncomeByUserId(userId);

        return right(Result.ok<{ total: number }>(
            {
                total: totalIncomes
            }
        ));
    }

}