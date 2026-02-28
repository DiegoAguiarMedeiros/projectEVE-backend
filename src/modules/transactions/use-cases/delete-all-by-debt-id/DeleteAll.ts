
import { UseCase } from "../../../../shared/core/UseCase";
import { Either, Result, left, right } from "../../../../shared/core/Result";
import { AppError } from "../../../../shared/core/AppError";
import { DeleteAllErrors } from "./DeleteAllErrors";
import { DeleteUseCase } from "../delete/DeleteUseCase";
import { Interface as ITransactionRepo } from "../../repos/Interface";
import pLimit from 'p-limit';
import { DeleteAllDTO } from "./DeleteAllDTO";


type Response = Either<
  DeleteAllErrors.DebtDoesntExistError |
  AppError.UnexpectedError |
  Result<any>,
  Result<void>
>

export class DeleteAll implements UseCase<DeleteAllDTO, Promise<Response>> {
  private deleteUseCase: DeleteUseCase;
  private transactionsRepo: ITransactionRepo;

  constructor(
    deleteUseCase: DeleteUseCase,
    transactionsRepo: ITransactionRepo
  ) {
    this.deleteUseCase = deleteUseCase;
    this.transactionsRepo = transactionsRepo;
  }

  public async execute(request: DeleteAllDTO): Promise<Response> {
    try {
      const { debtId, userId } = request;

      const transactions = await this.transactionsRepo.getAllByDebtId(debtId);

      const limit = pLimit(10);
      const promises: any[] = [];
      transactions.forEach(transaction => {
        promises.push(
          limit(() => {
            this.deleteUseCase.execute({ id: transaction.id.toString(), userId });
          })
        );
      });

      await Promise.allSettled(promises);
      return right(Result.ok<void>());

    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
