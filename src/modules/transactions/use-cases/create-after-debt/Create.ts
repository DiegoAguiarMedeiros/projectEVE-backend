
import { UseCase } from "../../../../shared/core/UseCase";
import { Repository as IRepo } from "../../repos/implementation/Repository";
import { CreateDTO } from "./CreateDTO";
import { Either, Result, left, right } from "../../../../shared/core/Result";
import { AppError } from "../../../../shared/core/AppError";
import { CreateErrors } from "./CreateErrors";
import { Debt } from "../../../debts/domain/Debt";
import { CreateUseCase } from "../create/CreateUseCase";
import { Interface as IDebtRepo } from "../../../debts/repos/Interface";
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

  constructor(debtRepo: IDebtRepo, createTransactionUseCase: CreateUseCase) {
    this.debtRepo = debtRepo;
    this.createTransactionUseCase = createTransactionUseCase;
  }

  public async execute(request: CreateDTO): Promise<Response> {

    let debt: Debt | null = null;
    const { debtId } = request;

    try {
      try {
        debt = await this.debtRepo.getOnlyById(debtId);
      } catch (err) {
        console.error("Error fetching debt or envelope:", err);
        return left(new CreateErrors.DebtDoesntExistError(debtId));
      }

      if (!debt) {
        console.error("Debt not found for ID:", debtId);
        return left(new CreateErrors.DebtDoesntExistError(debtId));
      }

      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();
      const limit = pLimit(10); 
      const promises = [];

      for (let i = debt.installmentsPaid.value + 1; i <= debt.installmentsTotal.value; i++) {
        const date = new Date(currentYear, currentMonth + i);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const reference = `${month < 10 ? '0' + month : month}/${year}`;

        promises.push(
          limit(() => {
            this.createTransactionUseCase.execute({
              description: `${debt!.description.value} - Parcela ${i} de ${debt!.installmentsTotal.value}`,
              amount: debt!.amount.value,
              date: new Date(year, month, debt!.paymentDay.value),
              type: "Debit",
              status: "Pending",
              envelopeId: debt!.envelopeId.value,
              paymentMethod: 'Ticket'
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