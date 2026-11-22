import { Interface as IProcessedIncomesRepo } from "../../repos/Interface";
import { DeleteAll as DeleteAllTransactions } from "../../../transactions/use-cases/delete-all-by-processed-incomes-id/DeleteAll";
import { AppError } from "../../../../shared/core/AppError";
import { left, right, Result } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { DeleteAllResponse } from "./DeleteAllResponse";

export interface DeleteAllDTO {
    ids: string[];
    userId: string;
}

export class DeleteAllUseCase implements UseCase<DeleteAllDTO, Promise<DeleteAllResponse>> {
    private repo: IProcessedIncomesRepo;
    private deleteAllTransactions: DeleteAllTransactions;

    constructor(repo: IProcessedIncomesRepo, deleteAllTransactions: DeleteAllTransactions) {
        this.repo = repo;
        this.deleteAllTransactions = deleteAllTransactions;
    }

    async execute(request: DeleteAllDTO): Promise<DeleteAllResponse> {
        try {
            const userRecords = await this.repo.getAll(request.userId);
            const ownedIds = userRecords
                .map((r) => r.id.toString())
                .filter((id) => request.ids.includes(id));

            for (const id of ownedIds) {
                await this.deleteAllTransactions.execute({ processedIncomesId: id });
            }

            if (ownedIds.length > 0) {
                await this.repo.deleteAll(ownedIds, request.userId);
            }

            return right(Result.ok<void>()) as DeleteAllResponse;
        } catch (err) {
            return left(new AppError.UnexpectedError(err)) as DeleteAllResponse;
        }
    }
}
