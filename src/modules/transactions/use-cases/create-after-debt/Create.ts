
import { UseCase } from "../../../../shared/core/UseCase";
import { CreateDTO } from "./CreateDTO";
import { Either, Result, left, right } from "../../../../shared/core/Result";
import { AppError } from "../../../../shared/core/AppError";
import { CreateErrors } from "./CreateErrors";
import { CreateUseCase } from "../create/CreateUseCase";
import { Interface as IDebtRepo } from "../../../debts/repos/Interface";
import { Interface as IenvelopeRepo } from "../../../envelopes/repos/Interface";
import { DeleteAll } from "../delete-all-by-debt-id/DeleteAll";
import pLimit from 'p-limit';


type Response = Either<
  CreateErrors.DebtDoesntExistError |
  AppError.UnexpectedError |
  Result<any>,
  Result<void>
>

export class Create implements UseCase<CreateDTO, Promise<Response>> {
  private debtRepo: IDebtRepo;
  private createTransactionUseCase: CreateUseCase;
  private envelopeRepo: IenvelopeRepo;
  private deleteAllByDebtId: DeleteAll;

  constructor(
    debtRepo: IDebtRepo,
    createTransactionUseCase: CreateUseCase,
    envelopeRepo: IenvelopeRepo,
    deleteAllByDebtId: DeleteAll
  ) {
    this.debtRepo = debtRepo;
    this.createTransactionUseCase = createTransactionUseCase;
    this.envelopeRepo = envelopeRepo;
    this.deleteAllByDebtId = deleteAllByDebtId;
  }

  public async execute(request: CreateDTO): Promise<Response> {

    const { debtId } = request;

    try {
      const debt = await this.debtRepo.getOnlyById(debtId);

      if (!debt) {
        console.error("Debt not found for ID:", debtId);
        return left(new CreateErrors.DebtDoesntExistError(debtId));
      }

      const envelope = await this.envelopeRepo.getOnlyById(debt.envelopeId.value);

      if (!envelope) {
        console.error("envelope not found for ID:", debt.envelopeId.value);
        return left(new CreateErrors.EnvelopeNotFound(debt.envelopeId.value));
      }

      await this.deleteAllByDebtId.execute({ debtId, userId: envelope.userId.value });

      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() - 1;
      const limit = pLimit(10);
      const promises = [];

      for (let i = debt.installmentsPaid.value + 1; i <= debt.installmentsTotal.value; i++) {
        const date = new Date(currentYear, currentMonth + i);
        const month = date.getMonth();
        const year = date.getFullYear();

        promises.push(
          limit(() => {
            this.createTransactionUseCase.execute({
              description: `${debt!.description.value} - Parcela ${i} de ${debt!.installmentsTotal.value}`,
              amount: debt!.amount.value,
              date: new Date(year, month, debt!.paymentDay.value),
              type: "Debit",
              status: "transaction.status.pending",
              envelopeId: debt!.envelopeId.value,
              paymentMethod: 'envelope.transaction.payment_method.Ticket',
              userId: envelope.userId.value,
              debtId,
            })
          })
        );
      }

      await Promise.allSettled(promises);

      return right(Result.ok<void>());

    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}