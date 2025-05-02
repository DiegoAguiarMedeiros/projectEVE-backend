import { Debt } from "../../../../domain/entities/debt/Debt";
import { PaymentMethod } from "../../../../domain/entities/transaction/PaymentMethod";
import { TransactionsStatus } from "../../../../domain/entities/transaction/TransactionsStatus";
import { TransactionsType } from "../../../../domain/entities/transaction/TransactionsType";
import { Balance } from "../../../../domain/shared/Balance";
import { Description } from "../../../../domain/shared/Description";
import { Id } from "../../../../domain/shared/Id";
import { UniqueEntityID } from "../../../../domain/shared/UniqueEntityID";
import { GetByIdUseCase as GetEnvelopeByIdUseCase } from "../../envelope/getById/GetByIdUseCase";
import { CreateResponse } from "./CreateResponse";
import { UseCase } from "../../../../domain/shared/core/UseCase";
import { left, Result, right } from "../../../../domain/shared/core/Result";
import { Transaction } from "../../../../domain/entities/transaction/Transaction";
import { AppError } from "../../../../domain/shared/core/AppError";
import { Interface as ITransactionRepo } from "../../../../domain/repositories/transaction/Interface";
import { CreateDTO } from "../../../../domain/dto/transaction";

export class CreateUseCase implements UseCase<CreateDTO, Promise<CreateResponse>> {
  private repo: ITransactionRepo;
  private getEnvelopeByIdUseCase: GetEnvelopeByIdUseCase;

  constructor(repo: ITransactionRepo, getEnvelopeByIdUseCase: GetEnvelopeByIdUseCase) {
    this.repo = repo;
    this.getEnvelopeByIdUseCase = getEnvelopeByIdUseCase;
  }

  async execute(request: CreateDTO): Promise<CreateResponse> {
    const DescriptionOrError = Description.create({ description: request.description });
    const AmountOrError = Balance.create({ balance: request.amount });
    const UserIdOrError = Id.create(new UniqueEntityID(request.userId));
    const IdOrError = Id.create(new UniqueEntityID());
    const CreditCardIdOrError = Id.create(new UniqueEntityID(request.creditCardId));
    const EvelopeIdOrError = Id.create(new UniqueEntityID(request.envelopeId));

    const dtoResult = Result.combine([
      DescriptionOrError, AmountOrError, UserIdOrError, IdOrError, CreditCardIdOrError, EvelopeIdOrError
    ]);

    if (dtoResult.isFailure) {
      return left(Result.fail<void>(dtoResult.getErrorValue())) as CreateResponse;
    }

    const envelopeOrError = await this.getEnvelopeByIdUseCase.execute({ userId: request.userId, id: request.envelopeId })

    if (envelopeOrError.isLeft()) {
      const error = envelopeOrError.value;
      switch (error.constructor) {
        default:
          return left(Result.fail<void>(error.getErrorValue() === undefined ?
            String(error.getErrorValue()) :
            error.getErrorValue().message === undefined ? String(error.getErrorValue()) : error.getErrorValue().message)) as CreateResponse;
      }
    }

    const envelopeId: Id = EvelopeIdOrError.getValue();
    const id: Id = IdOrError.getValue();
    const creditCardId: Id = CreditCardIdOrError.getValue();
    const description: Description = DescriptionOrError.getValue();
    const amount: Balance = AmountOrError.getValue();
    const paymentMethod: PaymentMethod = request.paymentMethod;
    const date: Date = request.date;
    const type: TransactionsType = request.type;
    const status: TransactionsStatus = request.status;

    try {

      const transactionOrError: Result<Transaction> = Transaction.create({
        id,
        creditCardId,
        envelopeId,
        description,
        amount,
        paymentMethod,
        date,
        type,
        status,
      });

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