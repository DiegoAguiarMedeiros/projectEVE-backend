
import { UseCase } from "../../../../shared/core/UseCase";
import { Repository as IRepo } from "../../repos/implementation/Repository";
import { UpdateDTO } from "./UpdateDTO";
import { Update as UpdateEnvelopeAmount } from "../update-amount-envelope/Update";
import { Repository as IEnvelopeRepo } from "../../repos/implementation/Repository";
import { Repository as ITransactionRepo } from "../../../transactions/repos/implementation/Repository";
import { Repository as IDebtRepo } from "../../../debts/repos/implementation/Repository";
import { Either, Result, left, right } from "../../../../shared/core/Result";
import { AppError } from "../../../../shared/core/AppError";
import { UpdateErrors } from "./UpdateErrors";
import { User } from "../../../users/domain/User";
import { Percentage } from "../../../../shared/domain/Percentage";

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



      const { transactionId, newAmount, oldAmount, userId } = request;

      const transaction = await this.transactionRepo.getById(transactionId, userId);


      if (!transaction) return left(new UpdateErrors.TransactionNotFound(transactionId));


      const envelopesAmount = await this.envelopeRepo.getAmount(transaction.envelopeId.value, transaction.date.getFullYear(), transaction.date.getMonth() + 1);

      if (envelopesAmount) {

        if (newAmount !== oldAmount) {

          await this.updateEnvelopeAmount.execute({
            envelopeId: transaction.envelopeId.value,
            amount: Number(envelopesAmount) - Number(oldAmount),
            year: transaction.date.getFullYear(),
            month: transaction.date.getMonth() + 1
          });

        }

        let amountToAdd: number = 0;
        if (transaction.type === "Debit") {
          if (transaction.status === 'Completed') {
            amountToAdd = Number(envelopesAmount) - Number(newAmount);
          } else {
            amountToAdd = Number(envelopesAmount) + Number(newAmount);
          }
        } else {
          if (transaction.status === 'Completed') {
            amountToAdd = Number(envelopesAmount) + Number(newAmount);
          } else {
            amountToAdd = Number(envelopesAmount) - Number(newAmount);
          }
        }
        await this.updateEnvelopeAmount.execute({
          envelopeId: transaction.envelopeId.value,
          amount: amountToAdd,
          year: transaction.date.getFullYear(),
          month: transaction.date.getMonth() + 1
        });

        // return right(Result.ok<void>()) as UpdateStatusResponse;

      }


      return right(Result.ok<void>());

    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}