
import { Interface as IFixedExpenseRepo } from "../../repos/Interface";
import { Interface as IEnvelopeRepo } from "../../../envelope/repos/Interface";
import { UseCase } from "../../../../../shared/core/UseCase";
import { CreateResponse } from "./CreateResponse";
import { FixedExpense } from "../../domain/FixedExpense";
import { Balance } from "../../../../../shared/domain/Balance";
import { Description } from "../../../../../shared/domain/Description";
import { Id } from "../../../../../shared/domain/Id";
import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";
import { EnvelopeMap } from "../../../envelope/mappers";
import { left, Result, right } from "../../../../../shared/core/Result";
import { AppError } from "../../../../../shared/core/AppError";
import { PaymentDay } from "../../../../../shared/domain/PaymentDay";
import { CreateErrors } from "./CreateErrors";
import { EnvelopeDTO } from "../../../envelope/dtos";
import { CreateDTO } from "../../dtos";

export class CreateUseCase implements UseCase<CreateDTO, Promise<CreateResponse>> {
  private repo: IFixedExpenseRepo;
  private envelopeRepo: IEnvelopeRepo;

  constructor(repo: IFixedExpenseRepo, envelopeRepo: IEnvelopeRepo) {
    this.repo = repo;
    this.envelopeRepo = envelopeRepo;
  }

  async execute(request: CreateDTO): Promise<CreateResponse> {

    const IdOrError = Id.create(new UniqueEntityID());

    const envelope = await this.envelopeRepo.getById(request.envelope.id, request.envelope.userId);

    if (!envelope) {
      return left(new CreateErrors.EnvelopeNotFound(request.envelope.id)) as CreateResponse;
    }


    
    const DescriptionOrError = Description.create({ description: request.description });
    const AmountOrError = Balance.create({ balance: request.amount });
    const PaymentDayOrError = PaymentDay.create({ paymentDay: request.paymentDay });

    const dtoResult = Result.combine([
      DescriptionOrError, AmountOrError,  IdOrError, PaymentDayOrError
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