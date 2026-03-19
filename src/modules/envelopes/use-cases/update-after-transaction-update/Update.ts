
import { UseCase } from "../../../../shared/core/UseCase";
import { UpdateDTO } from "./UpdateDTO";
import { Update as UpdateEnvelopeAmount } from "../update-amount-envelope/Update";
import { Repository as IEnvelopeRepo } from "../../repos/implementation/Repository";
import { Repository as ITransactionRepo } from "../../../transactions/repos/implementation/Repository";
import { Either, Result, left, right } from "../../../../shared/core/Result";
import { AppError } from "../../../../shared/core/AppError";
import { UpdateErrors } from "./UpdateErrors";

type Response = Either<
  UpdateErrors.UserDoesntExistError |
  AppError.UnexpectedError |
  Result<any>,
  Result<void>
>

export class Update implements UseCase<UpdateDTO, Promise<Response>> {
  private envelopeRepo: IEnvelopeRepo;
  private transactionRepo: ITransactionRepo;
  private updateEnvelopeAmount: UpdateEnvelopeAmount;

  constructor(envelopeRepo: IEnvelopeRepo, transactionRepo: ITransactionRepo, updateEnvelopeAmount: UpdateEnvelopeAmount) {
    this.envelopeRepo = envelopeRepo;
    this.transactionRepo = transactionRepo;
    this.updateEnvelopeAmount = updateEnvelopeAmount;
  }

  public async execute(request: UpdateDTO): Promise<Response> {
    try {
      const { transactionId, newAmount, oldAmount, oldStatus, userId } = request;

      const transaction = await this.transactionRepo.getById(transactionId, userId);

      if (!transaction) return left(new UpdateErrors.TransactionNotFound(transactionId));

      const envelopesAmount = await this.envelopeRepo.getAmount(transaction.envelopeId.value, transaction.date.getFullYear(), transaction.date.getMonth() + 1);

      if (envelopesAmount !== null) {
        const wasCompleted = oldStatus === 'transaction.status.completed';
        const isNowCompleted = transaction.status === 'transaction.status.completed';
        const isDebit = transaction.type === "Debit";

        // Delta: reverse the old effect, then apply the new effect
        let delta = 0;
        if (isDebit) {
          if (wasCompleted) delta += Number(oldAmount);   // undo old deduction
          if (isNowCompleted) delta -= Number(newAmount); // apply new deduction
        } else {
          if (wasCompleted) delta -= Number(oldAmount);   // undo old addition
          if (isNowCompleted) delta += Number(newAmount); // apply new addition
        }

        if (delta !== 0) {
          await this.updateEnvelopeAmount.execute({
            envelopeId: transaction.envelopeId.value,
            amount: Number(envelopesAmount) + delta,
            year: transaction.date.getFullYear(),
            month: transaction.date.getMonth() + 1,
          });
        }
      }

      return right(Result.ok<void>());

    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}