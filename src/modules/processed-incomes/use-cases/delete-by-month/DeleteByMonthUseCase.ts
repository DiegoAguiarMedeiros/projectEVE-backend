import { Interface as IProcessedIncomesRepo } from "../../repos/Interface";
import { AppError } from "../../../../shared/core/AppError";
import { left, right, Result } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { DeleteByMonthResponse } from "./DeleteByMonthResponse";
import { ResetAll } from "../../../transactions/use-cases/reset-all-by-processed-incomes-id/ResetAll";

export interface DeleteByMonthDTO {
    year: number;
    month: number;
    userId: string;
}

export class DeleteByMonthUseCase implements UseCase<DeleteByMonthDTO, Promise<DeleteByMonthResponse>> {
    private repo: IProcessedIncomesRepo;
    private resetAll: ResetAll;

    constructor(repo: IProcessedIncomesRepo, resetAll: ResetAll) {
        this.repo = repo;
        this.resetAll = resetAll;
    }

    async execute({ year, month, userId }: DeleteByMonthDTO): Promise<DeleteByMonthResponse> {
        try {
            const items = await this.repo.getAllByYearMonth(userId, year, month);
            const ids = items.map(item => item.id.toString());

            // Reset transactions and envelope balances synchronously before deleting,
            // so that a subsequent reprocess sees a consistent state.
            for (const item of items) {
                await this.resetAll.execute({
                    processedIncomesId: item.id.toString(),
                    userId,
                    year,
                    month,
                });
            }

            await this.repo.deleteAll(ids, userId);

            return right(Result.ok<void>()) as DeleteByMonthResponse;
        } catch (err) {
            return left(new AppError.UnexpectedError(err)) as DeleteByMonthResponse;
        }
    }
}
