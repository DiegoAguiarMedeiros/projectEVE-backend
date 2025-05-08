import { Debt } from "../../../../domain/entities/debt/Debt";
import { PaymentMethod } from "../../../../domain/entities/transaction/PaymentMethod";
import { TransactionStatus } from "../../../../domain/entities/transaction/TransactionStatus";
import { TransactionType } from "../../../../domain/entities/transaction/TransactionType";
import { Balance } from "../../../../domain/shared/Balance";
import { Description } from "../../../../domain/shared/Description";
import { Id } from "../../../../domain/shared/Id";
import { UniqueEntityID } from "../../../../domain/shared/UniqueEntityID";
import { CreateResponse } from "./CreateResponse";
import { UseCase } from "../../../../domain/shared/core/UseCase";
import { left, Result, right } from "../../../../domain/shared/core/Result";
import { Transaction, TransactionProps } from "../../../../domain/entities/transaction/Transaction";
import { AppError } from "../../../../domain/shared/core/AppError";
import { Interface as ITransactionRepo } from "../../../../domain/repositories/transaction/Interface";
import { Interface as IEnvelopeRepo } from "../../../../domain/repositories/envelope/Interface";
import { CreateDTO } from "../../../../domain/dto/transaction";
import { CreateErrors } from "./CreateErrors";
import { EnvelopeDTO } from "../../../../domain/dto/envelope";
import { EnvelopeMap } from "../../../../shared/mappers/envelope";

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
    const IdOrError = Id.create(new UniqueEntityID());
    const CreditCardIdOrError = Id.create(new UniqueEntityID(request.creditCardId));
    const EvelopeIdOrError = Id.create(new UniqueEntityID(request.envelope.id));

    const dtoResult = Result.combine([
      DescriptionOrError, AmountOrError, UserIdOrError, IdOrError, CreditCardIdOrError, EvelopeIdOrError
    ]);

    if (dtoResult.isFailure) {
      return left(Result.fail<void>(dtoResult.getErrorValue())) as CreateResponse;
    }

    const envelope = await this.envelopeRepo.getById(request.envelope.id, request.envelope.userId);

    if (!envelope) {
      return left(new CreateErrors.EnvelopeNotFound(request.envelope.id)) as CreateResponse;
    }


    const envelopeDTO: EnvelopeDTO = EnvelopeMap.toDTO(envelope);
    const id: Id = IdOrError.getValue();
    const creditCardId: Id = CreditCardIdOrError.getValue();
    const description: Description = DescriptionOrError.getValue();
    const amount: Balance = AmountOrError.getValue();
    const paymentMethod: PaymentMethod = request.paymentMethod;
    const date: Date = request.date;
    const type: TransactionType = request.type;
    const status: TransactionStatus = request.status;

    try {

      const transactionProps: TransactionProps = {
        id,
        envelope: envelopeDTO,
        description,
        amount,
        paymentMethod,
        date,
        type,
        status,
      }

      if (request.creditCardId) transactionProps.creditCardId = creditCardId;

      const transactionOrError: Result<Transaction> = Transaction.create(transactionProps);

      if (transactionOrError.isFailure) {
        return left(
          Result.fail<Debt>(transactionOrError.getErrorValue().toString())
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