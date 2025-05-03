
import { Interface as IFixedExpenseRepo } from "../../../../domain/repositories/fixedExpense/Interface";
import { Interface as IEnvelopeRepo } from "../../../../domain/repositories/envelope/Interface";
import { UseCase } from "../../../../domain/shared/core/UseCase";
import { CreateResponse } from "./CreateResponse";
import { FixedExpense } from "../../../../domain/entities/fixedExpense/FixedExpense";
import { Balance } from "../../../../domain/shared/Balance";
import { Description } from "../../../../domain/shared/Description";
import { Id } from "../../../../domain/shared/Id";
import { UniqueEntityID } from "../../../../domain/shared/UniqueEntityID";
import { EnvelopeMap } from "../../../../shared/mappers/envelope";
import { left, Result, right } from "../../../../domain/shared/core/Result";
import { AppError } from "../../../../domain/shared/core/AppError";
import { PaymentDay } from "../../../../domain/shared/PaymentDay";
import { CreateDTO } from "../../../../domain/dto/fixedExpense";
import { CreateErrors } from "./CreateErrors";
import { EnvelopeDTO } from "../../../../domain/dto/envelope";

export class CreateUseCase implements UseCase<CreateDTO, Promise<CreateResponse>> {
  private repo: IFixedExpenseRepo;
  private envelopeRepo: IEnvelopeRepo;

  constructor(repo: IFixedExpenseRepo, envelopeRepo: IEnvelopeRepo) {
    this.repo = repo;
    this.envelopeRepo = envelopeRepo;
  }

  async execute(request: CreateDTO): Promise<CreateResponse> {

    console.log("request", request);
    const IdOrError = Id.create(new UniqueEntityID());
    const envelope = await this.envelopeRepo.getById(request.envelope.id, request.envelope.userId);

    if (!envelope) {
      return left(new CreateErrors.EnvelopeNotFound(request.envelope.id)) as CreateResponse;
    }


    const EnvelopeIdOrError = Id.create(new UniqueEntityID(request.envelope.id));
    const DescriptionOrError = Description.create({ description: request.description });
    const AmountOrError = Balance.create({ balance: request.amount });
    const PaymentDayOrError = PaymentDay.create({ paymentDay: request.paymentDay });

    const dtoResult = Result.combine([
      DescriptionOrError, AmountOrError, EnvelopeIdOrError, IdOrError, PaymentDayOrError
    ]);


    if (dtoResult.isFailure) {
      return left(Result.fail<void>(dtoResult.getErrorValue())) as CreateResponse;
    }

    const id: Id = IdOrError.getValue();
    const envelopeDTO: EnvelopeDTO = EnvelopeMap.toDTO(envelope);
    const description: Description = DescriptionOrError.getValue();
    const amount: Balance = AmountOrError.getValue();
    const paymentDay: PaymentDay = PaymentDayOrError.getValue();

    try {

      const fixedExpenseOrError: Result<FixedExpense> = FixedExpense.create({
        id,
        envelope: envelopeDTO,
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