import { Interface as ITransactionsRepo } from "../../../transactions/repos/Interface";
import { Result, right } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { Either } from "../../../../shared/core/Result";
import { AppError } from "../../../../shared/core/AppError";

type GetGoalsCumulativeAmountResponse = Either<AppError.UnexpectedError, Result<number>>;

export class GetGoalsCumulativeAmountUseCase implements UseCase<{ id: string; year: number; month: number }, Promise<GetGoalsCumulativeAmountResponse>> {
    private transactionsRepo: ITransactionsRepo;

    constructor(transactionsRepo: ITransactionsRepo) {
        this.transactionsRepo = transactionsRepo;
    }

    async execute({ id, year, month }: { id: string; year: number; month: number }): Promise<GetGoalsCumulativeAmountResponse> {
        const total = await this.transactionsRepo.getGoalsCumulativeAmount(year, month, id);
        return right(Result.ok<number>(total));
    }
}
