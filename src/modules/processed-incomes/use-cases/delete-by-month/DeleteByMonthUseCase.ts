import { Interface as IProcessedIncomesRepo } from "../../repos/Interface";
import { DeleteAll as DeleteAllTransactions } from "../../../transactions/use-cases/delete-all-by-processed-incomes-id/DeleteAll";
import { AppError } from "../../../../shared/core/AppError";
import { left, right, Result } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { DeleteByMonthResponse } from "./DeleteByMonthResponse";

export interface DeleteByMonthDTO {
    year: number;
    month: number;
    userId: string;
}

export class DeleteByMonthUseCase implements UseCase<DeleteByMonthDTO, Promise<DeleteByMonthResponse>> {
    private repo: IProcessedIncomesRepo;
    private deleteAllTransactions: DeleteAllTransactions;

    constructor(repo: IProcessedIncomesRepo, deleteAllTransactions: DeleteAllTransactions) {
        this.repo = repo;
        this.deleteAllTransactions = deleteAllTransactions;
    }

    async execute({ year, month, userId }: DeleteByMonthDTO): Promise<DeleteByMonthResponse> {
        try {
            const items = await this.repo.getAllByYearMonth(userId, year, month);
            const ids = items.map(item => item.id.toString());

            await Promise.all(
                ids.map(id =>
                    this.deleteAllTransactions.execute({ processedIncomesId: id, userId })
                )
            );

            await this.repo.deleteAll(ids, userId);

            return right(Result.ok<void>()) as DeleteByMonthResponse;
        } catch (err) {
            return left(new AppError.UnexpectedError(err)) as DeleteByMonthResponse;
        }
    }
}
