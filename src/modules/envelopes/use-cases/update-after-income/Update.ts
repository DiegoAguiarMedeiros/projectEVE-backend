
import { UseCase } from "../../../../shared/core/UseCase";
import { Repository as IRepo } from "../../repos/implementation/Repository";
import { UpdateDTO } from "./UpdateDTO";
import { Repository as IEnvelopeRepo } from "../../repos/implementation/Repository";
import { Repository as IIncomeRepo } from "../../../incomes/repos/implementation/Repository";
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
  private incomeRepo: IIncomeRepo;
  private debtRepo: IDebtRepo;

  constructor(envelopeRepo: IEnvelopeRepo, incomeRepo: IIncomeRepo, debtRepo: IDebtRepo) {
    this.envelopeRepo = envelopeRepo;
    this.incomeRepo = incomeRepo;
    this.debtRepo = debtRepo;
  }

  public async execute(request: UpdateDTO): Promise<Response> {
    try {
      const { userId } = request;


      const envelope = await this.envelopeRepo.getByName('debts', userId);

      if (!envelope) {
        return left(new UpdateErrors.EnvelopeNotFound('debts'))
      }
      const totalDebt = await this.debtRepo.getTotal(envelope.id.toString());
      const totalIncome = await this.incomeRepo.getTotal(userId);

      const debtPercentagem = totalDebt > 0 && totalIncome > 0
        ? Math.ceil((totalDebt / totalIncome) * 100)
        : 0;

      const percentageOrError = Percentage.create({ percentage: debtPercentagem });

      if (percentageOrError.isSuccess) {
        const debtPct = percentageOrError.getValue();

        const allEnvelopes = await this.envelopeRepo.getAll(userId);
        const otherEnvelopes = allEnvelopes.filter(e => e.name.value !== 'debts');
        const currentTotal = otherEnvelopes.reduce((sum, e) => sum + e.percentage.value, 0);

        if (currentTotal + debtPct.value > 100) {
          let excess = currentTotal + debtPct.value - 100;
          const sorted = [...otherEnvelopes].sort((a, b) => b.percentage.value - a.percentage.value);

          for (const env of sorted) {
            if (excess <= 0) break;
            const reduction = Math.min(env.percentage.value, excess);
            const newPct = Percentage.create({ percentage: env.percentage.value - reduction });
            if (newPct.isSuccess) {
              env.updatePercentage(newPct.getValue());
              await this.envelopeRepo.update(env.id.toString(), env);
            }
            excess -= reduction;
          }
        }

        envelope.updatePercentage(debtPct);
        const update = await this.envelopeRepo.update(envelope.id.toString(), envelope);
        if (update) return right(Result.ok<void>())
      }

      return right(Result.ok<void>());

    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}