
import { Percentage } from "../../../../../shared/domain/Percentage";
import { Interface as IMonthlyEnvelopeRepo } from "../../repos/Interface";
import { Balance } from "../../../../../shared/domain/Balance";
import { AppError } from "../../../../../shared/core/AppError";
import { left, Result, right } from "../../../../../shared/core/Result";
import { UseCase } from "../../../../../shared/core/UseCase";
import { Id } from "../../../../../shared/domain/Id";
import { Name } from "../../../../../shared/domain/Name";
import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";
import { CreateErrors } from "./CreateErrors";
import { CreateResponse } from "./CreateResponse";
import { CreateMonthlyWithTansactionDTO } from "../../dtos";
import { Reference, MonthlyEnvelope } from "../../domain";
import { CreateUseCase as CreateTransactionUseCase } from "../../../transaction/use-cases/create/CreateUseCase";
import { Description } from "../../../../../shared/domain/Description";


export class CreateUseCase implements UseCase<CreateMonthlyWithTansactionDTO, Promise<CreateResponse>> {
  private repo: IMonthlyEnvelopeRepo;
  private createTransactionUseCase: CreateTransactionUseCase;

  constructor(repo: IMonthlyEnvelopeRepo, createTransactionUseCase: CreateTransactionUseCase) {
    this.repo = repo;
    this.createTransactionUseCase = createTransactionUseCase;
  }

  async execute(request: CreateMonthlyWithTansactionDTO): Promise<CreateResponse> {


    try {

      const balanceOrError = Balance.create({ balance: 0 });
      const referenceOrError = Reference.create({ reference: request.reference });
      const envelopeIdOrError = Id.create(new UniqueEntityID(request.envelopeId));
      const percentageOrError = Percentage.create({ percentage: request.percentage });


      const dtoResult = Result.combine([
        referenceOrError, balanceOrError, percentageOrError, envelopeIdOrError
      ]);

      if (dtoResult.isFailure) {
        return left(Result.fail<void>(dtoResult.getErrorValue())) as CreateResponse;
      }

      const envelopeId: Id = envelopeIdOrError.getValue();
      const balance: Balance = balanceOrError.getValue();
      const reference: Reference = referenceOrError.getValue();
      const percentage: Percentage = percentageOrError.getValue();

      const MonthlyEnvelopeOrError: Result<MonthlyEnvelope> = MonthlyEnvelope.create({
        percentage,
        balance,
        reference,
        envelopeId,
      },  new UniqueEntityID(request.monthlyEnvelopeId));

      if (MonthlyEnvelopeOrError.isFailure) {
        return left(
          Result.fail<MonthlyEnvelope>(MonthlyEnvelopeOrError.getErrorValue().toString())
        ) as CreateResponse;
      }

      const monthlyEnvelope: MonthlyEnvelope = MonthlyEnvelopeOrError.getValue();

      if (request.createMonthlyEnvelope) {
        await this.repo.create(monthlyEnvelope);
      }

      const descriptionOrError = Description.create({ description: request.description });
      const amountOrError = Balance.create({ balance: request.amount });
      const debtIdOrError = Id.create(new UniqueEntityID(request.debtId));


      const dtoTransactionResult = Result.combine([
        descriptionOrError, amountOrError, debtIdOrError
      ]);

      if (dtoTransactionResult.isFailure) {
        return left(Result.fail<void>(dtoTransactionResult.getErrorValue())) as CreateResponse;
      }

      const debtId: Id = debtIdOrError.getValue();
      const amount: Balance = amountOrError.getValue();
      const description: Description = descriptionOrError.getValue();

      this.createTransactionUseCase.execute({
        description: description.value,
        amount: amount.value,
        paymentMethod: "Ticket",
        date: request.date,
        type: "Debit",
        status: "Pending",
        monthlyEnvelopeId: monthlyEnvelope.id.toString(),
        debtId: debtId.value
      });


      return right(Result.ok<void>())

    } catch (err) {
      console.error("Error creating MonthlyEnvelope:", err);
      return left(new AppError.UnexpectedError(err)) as CreateResponse;
    }
  }
}