
import { Balance } from "../../../../../shared/domain/Balance";
import { Description } from "../../../../../shared/domain/Description";
import { Id } from "../../../../../shared/domain/Id";
import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";
import { CreateResponse } from "./CreateResponse";
import { UseCase } from "../../../../../shared/core/UseCase";
import { left, Result, right } from "../../../../../shared/core/Result";
import { AppError } from "../../../../../shared/core/AppError";
import { Interface as ITransactionRepo } from "../../repos/Interface";
import { Interface as IEnvelopeRepo } from "../../../../budgeting/envelope/repos/Interface";
import { CreateDTO } from "../../dtos";
import { CreateErrors } from "./CreateErrors";
import { EnvelopeDTO } from "../../../../budgeting/envelope/dtos";
import { EnvelopeMap } from "../../../../budgeting/envelope/mappers";
import { Transaction,PaymentMethod, TransactionType, TransactionStatus, TransactionProps } from "../../domain";

export class CreateUseCase implements UseCase<CreateDTO, Promise<CreateResponse>> {
  private repo: ITransactionRepo;
  private envelopeRepo: IEnvelopeRepo;

  constructor(repo: ITransactionRepo, envelopeRepo: IEnvelopeRepo) {
    this.repo = repo;
    this.envelopeRepo = envelopeRepo;
  }

  async execute(request: CreateDTO): Promise<CreateResponse> {

    const DescriptionOrError = Description.create({ description: request.description });
    const AmountOrError = Balance.create({ balance: request.amount });
    const UserIdOrError = Id.create(new UniqueEntityID(request.envelope.userId));
    const CreditCardIdOrError = Id.create(new UniqueEntityID(request.creditCardId));
    const EvelopeIdOrError = Id.create(new UniqueEntityID(request.envelope.id));

    const dtoResult = Result.combine([
      DescriptionOrError, AmountOrError, UserIdOrError, CreditCardIdOrError, EvelopeIdOrError
    ]);

    if (dtoResult.isFailure) {
      return left(Result.fail<void>(dtoResult.getErrorValue())) as CreateResponse;
    }

    const envelope = await this.envelopeRepo.getById(request.envelope.id, request.envelope.userId);

    if (!envelope) {
      return left(new CreateErrors.EnvelopeNotFound(request.envelope.id)) as CreateResponse;
    }


    const envelopeDTO: EnvelopeDTO = EnvelopeMap.toDTO(envelope);
    const creditCardId: Id = CreditCardIdOrError.getValue();
    const description: Description = DescriptionOrError.getValue();
    const amount: Balance = AmountOrError.getValue();
    const paymentMethod: PaymentMethod = request.paymentMethod;
    const date: Date = request.date;
    const type: TransactionType = request.type;
    const status: TransactionStatus = request.status;

    try {

      const transactionProps: TransactionProps = {
        envelope: envelopeDTO,
        description,
        amount,
        paymentMethod,
        date,
        type,
        status,
      }

      if (request.creditCardId) transactionProps.creditCardId = creditCardId;

      const transactionOrError: Result<Transaction> = Transaction.create(transactionProps, new UniqueEntityID());

      if (transactionOrError.isFailure) {
        return left(
          Result.fail<Transaction>(transactionOrError.getErrorValue().toString())
        ) as CreateResponse;
      }

      const transaction: Transaction = transactionOrError.getValue();

      await this.repo.create(transaction);

      return right(Result.ok<void>())

    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as CreateResponse;
    }
  }
}