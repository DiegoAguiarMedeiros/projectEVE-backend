
import { UseCase } from "../../../../shared/core/UseCase";
import { Repository as IRepo } from "../../repos/implementation/Repository";
import { Either, Result, left, right } from "../../../../shared/core/Result";
import { AppError } from "../../../../shared/core/AppError";
import { DeleteAllErrors } from "./DeleteAllErrors";
import { ProcessedIncomes } from "../../../processed-incomes/domain/ProcessedIncomes";
import { DeleteUseCase } from "../delete/DeleteUseCase";
import { Interface as IProcessedIncomesRepo } from "../../../processed-incomes/repos/Interface";
import { Interface as IEnvelopsRepo } from "../../../envelopes/repos/Interface";
import { Interface as IFixedExpensesRepo } from "../../../fixed-expenses/repos/Interface";
import { Interface as ITransactionRepo } from "../../repos/Interface";
import { Interface as IMonthlyEnvelopeRepo } from "../../repos/Interface";
import { Envelopes } from "../../../envelopes/domain/Envelopes";
import pLimit from 'p-limit';
import { DeleteAllDTO } from "./DeleteAllDTO";


type Response = Either<
  DeleteAllErrors.ProcessedIncomesDoesntExistError |
  AppError.UnexpectedError |
  Result<any>,
  Result<void>
>

export class DeleteAll implements UseCase<DeleteAllDTO, Promise<Response>> {
  private deleteUseCase: DeleteUseCase
  private transactionsRepo: ITransactionRepo

  constructor(
    deleteUseCase: DeleteUseCase,
    transactionsRepo: ITransactionRepo
  ) {
    this.deleteUseCase = deleteUseCase;
    this.transactionsRepo = transactionsRepo;
  }

  public async execute(request: DeleteAllDTO): Promise<Response> {
    try {
      const { processedIncomesId } = request;

      const transactions = await this.transactionsRepo.getAllByProcessedIncomesId(processedIncomesId);

      if (!transactions) {
        return left(new DeleteAllErrors.ProcessedIncomesDoesntExistError(processedIncomesId));
      }

      const limit = pLimit(10);
      const promises: any[] = [];
      transactions.forEach(transaction => {
        promises.push(
          limit(() => {
            this.deleteUseCase.execute({ id: transaction.id.toString(), userId: request.userId })
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