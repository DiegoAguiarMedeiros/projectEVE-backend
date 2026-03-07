import { DeleteDTO } from "../../dtos";
import { Interface as IProcessedIncomesRepo } from "../../repos/Interface";
import { DeleteAll } from "../../../transactions/use-cases/delete-all-by-processed-incomes-id/DeleteAll";
import { AppError } from "../../../../shared/core/AppError";
import { left, right, Result } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { DeleteErrors } from "./DeleteErrors";
import { DeleteResponse } from "./DeleteResponse";

export class DeleteUseCase implements UseCase<DeleteDTO, Promise<DeleteResponse>> {
  private repo: IProcessedIncomesRepo;
  private deleteAllTransactions: DeleteAll;

  constructor(repo: IProcessedIncomesRepo, deleteAllTransactions: DeleteAll) {
    this.repo = repo;
    this.deleteAllTransactions = deleteAllTransactions;
  }

  async execute(request: DeleteDTO): Promise<DeleteResponse> {
    try {
      const processedIncome = await this.repo.getById(request.id, request.userId);

      if (!processedIncome) {
        return left(new DeleteErrors.NotFound(request.id)) as DeleteResponse;
      }

      await this.deleteAllTransactions.execute({
        processedIncomesId: request.id,
        userId: request.userId,
      });

      await this.repo.delete(request.id);

      return right(Result.ok<void>()) as DeleteResponse;
    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as DeleteResponse;
    }
  }
}
