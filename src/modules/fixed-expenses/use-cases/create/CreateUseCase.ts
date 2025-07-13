
import { Interface as IFixedExpenseRepo } from "../../repos/Interface";
import { Interface as IEnvelopeRepo } from "../../../envelopes/repos/Interface";
import { UseCase } from "../../../../shared/core/UseCase";
import { CreateResponse } from "./CreateResponse";
import { FixedExpense } from "../../domain/FixedExpense";
import { Balance } from "../../../../shared/domain/Balance";
import { Description } from "../../../../shared/domain/Description";
import { Id } from "../../../../shared/domain/Id";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";
import { left, Result, right } from "../../../../shared/core/Result";
import { AppError } from "../../../../shared/core/AppError";
import { PaymentDay } from "../../../../shared/domain/PaymentDay";
import { CreateErrors } from "./CreateErrors";
import { CreateDTO } from "../../dtos";

export class CreateUseCase implements UseCase<CreateDTO, Promise<CreateResponse>> {
  private repo: IFixedExpenseRepo;
  private envelopeRepo: IEnvelopeRepo;

  constructor(repo: IFixedExpenseRepo, envelopeRepo: IEnvelopeRepo) {
    this.repo = repo;
    this.envelopeRepo = envelopeRepo;
  }

  async execute(request: CreateDTO): Promise<CreateResponse> {

    const envelope = await this.envelopeRepo.getById(request.envelopeId, request.userId);

    if (!envelope) {
      return left(new CreateErrors.EnvelopeNotFound(request.envelopeId)) as CreateResponse;
    }
    
    const EnvelopeIdOrError = Id.create(new UniqueEntityID(request.envelopeId));
    const DescriptionOrError = Description.create({ description: request.description });
    const AmountOrError = Balance.create({ balance: request.amount });
    const PaymentDayOrError = PaymentDay.create({ paymentDay: request.paymentDay });

    const dtoResult = Result.combine([
      EnvelopeIdOrError,DescriptionOrError, AmountOrError, PaymentDayOrError
    ]);


    if (dtoResult.isFailure) {
      return left(Result.fail<void>(dtoResult.getErrorValue())) as CreateResponse;
    }

    const envelopeId: Id = EnvelopeIdOrError.getValue();
    const description: Description = DescriptionOrError.getValue();
    const amount: Balance = AmountOrError.getValue();
    const paymentDay: PaymentDay = PaymentDayOrError.getValue();

    try {

      const fixedExpenseOrError: Result<FixedExpense> = FixedExpense.create({
        envelopeId,
        description,
        amount,
        paymentDay,
      });

      if (fixedExpenseOrError.isFailure) {
        return left(
          Result.fail<FixedExpense>(fixedExpenseOrError.getErrorValue().toString())
        ) as CreateResponse;
      }

      const fixedExpense: FixedExpense = fixedExpenseOrError.getValue();
      await this.repo.create(fixedExpense);

      return right(Result.ok<void>())

    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as CreateResponse;
    }
  }
}