
import { UseCase } from "../../../../shared/core/UseCase";
import { Repository as IRepo } from "../../repos/implementation/Repository";
import { CreateDTO } from "./CreateDTO";
import { Either, Result, left, right } from "../../../../shared/core/Result";
import { AppError } from "../../../../shared/core/AppError";
import { CreateErrors } from "./CreateErrors";
import { Debt } from "../../../debts/domain/Debt";
import { CreateUseCase } from "../create/CreateUseCase";
import { Interface as IDebtRepo } from "../../../debts/repos/Interface";
import { Interface as IenvelopeRepo } from "../../../envelopes/repos/Interface";
import pLimit from 'p-limit';


type Response = Either<
  CreateErrors.DebtDoesntExistError |
  AppError.UnexpectedError |
  Result<any>,
  Result<void>
>

export class Create implements UseCase<CreateDTO, Promise<Response>> {
  private debtRepo: IDebtRepo;
  private createTransactionUseCase: CreateUseCase
  private envelopeRepo: IenvelopeRepo;
  constructor(debtRepo: IDebtRepo, createTransactionUseCase: CreateUseCase, envelopeRepo: IenvelopeRepo) {
    this.debtRepo = debtRepo;
    this.createTransactionUseCase = createTransactionUseCase;
    this.envelopeRepo = envelopeRepo;
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
              status: "Pending",
              envelopeId: debt!.envelopeId.value,
              paymentMethod: 'Ticket',
              userId: envelope.userId.value
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