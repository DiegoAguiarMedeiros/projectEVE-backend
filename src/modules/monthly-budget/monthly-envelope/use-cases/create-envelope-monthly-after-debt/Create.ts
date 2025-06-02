
import { UseCase } from "../../../../../shared/core/UseCase";
import { Repository as IRepo } from "../../repos/implementation/Repository";
import { CreateDTO } from "./CreateDTO";
import { Either, Result, left, right } from "../../../../../shared/core/Result";
import { AppError } from "../../../../../shared/core/AppError";
import { CreateErrors } from "./CreateErrors";
import { Debt } from "../../../../debt/domain/Debt";
import { CreateUseCase } from "../create/CreateUseCase";
import { CreateUseCase as CreateTransactionUseCase } from "../../../transaction/use-cases/create/CreateUseCase";
import { Interface as IDebtRepo } from "../../../../debt/repos/Interface";
import { Interface as IMonthlyEnvelopeRepo } from "../../../../monthly-budget/monthly-envelope/repos/Interface";
import { Interface as IEnvelopeRepo } from "../../../../budgeting/envelope/repos/Interface";
import { Envelope } from "../../../../budgeting/envelope/domain/Envelope";
import pLimit from 'p-limit';


type Response = Either<
  CreateErrors.DebtDoesntExistError |
  AppError.UnexpectedError |
  Result<any>,
  Result<void>
>

export class Create implements UseCase<CreateDTO, Promise<Response>> {
  private debtRepo: IDebtRepo;
  private envelopeRepo: IEnvelopeRepo;
  private monthlyEnvelopeRepo: IMonthlyEnvelopeRepo;
  private createEnvelopeMonthlyUseCase: CreateUseCase;

  constructor(debtRepo: IDebtRepo, envelopeRepo: IEnvelopeRepo, monthlyEnvelopeRepo: IMonthlyEnvelopeRepo, createEnvelopeMonthlyUseCase: CreateUseCase) {
    this.debtRepo = debtRepo;
    this.envelopeRepo = envelopeRepo;
    this.monthlyEnvelopeRepo = monthlyEnvelopeRepo;
    this.createEnvelopeMonthlyUseCase = createEnvelopeMonthlyUseCase;
  }

  public async execute(request: CreateDTO): Promise<Response> {

    let debt: Debt | null = null;
    let envelope: Envelope | null = null;
    const { debtId, envelopeId } = request;

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

      try {
        envelope = await this.envelopeRepo.getOnlyById(envelopeId);
      } catch (err) {
        console.error("Error fetching envelope or envelope:", err);
        return left(new CreateErrors.DebtDoesntExistError(debtId));
      }
      if (!envelope) {
        console.error("Envelope not found for ID:", envelopeId);
        return left(new CreateErrors.EnvelopeDoesntExistError(envelopeId));
      }

      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();
      const limit = pLimit(10); // até 10 promessas simultâneas
      const promises = [];

      for (let i = debt.installmentsPaid.value; i <= debt.installmentsTotal.value; i++) {
        const date = new Date(currentYear, currentMonth + i);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const reference = `${month < 10 ? '0' + month : month}/${year}`;

        const envelopeMonthlyExists = await this.monthlyEnvelopeRepo.getByReferenceAndEnvelopeId(reference, envelope.id.toString());
        console.log(`Checking envelope monthly for reference ${reference} and envelope ID ${envelope.id.toString()}:`, envelopeMonthlyExists);
       
          promises.push(
            limit(() => {
              this.createEnvelopeMonthlyUseCase.execute({
                createMonthlyEnvelope:!envelopeMonthlyExists,
                monthlyEnvelopeId: envelopeMonthlyExists ? envelopeMonthlyExists.id.toString() : undefined,
                percentage: envelope!.percentage.value,
                envelopeId: envelope!.id.toString(),
                balance: 0,
                reference,
                description: `${debt!.description.value} - Parcela ${i} de ${debt!.installmentsTotal.value}`,
                amount: debt!.amount.value / debt!.installmentsTotal.value,
                date: new Date(year, month, debt!.paymentDay.value),
                debtId: debt!.id.toString()
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