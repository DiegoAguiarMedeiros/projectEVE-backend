
import { CreateDTO } from "./CreateDTO";
import { Result, left, right } from "../../../../../shared/core/Result";
import { AppError } from "../../../../../shared/core/AppError";
import { ITransactionRepo } from "../../../repos/TransactionsRepo";
import { UseCase } from "../../../../../shared/core/UseCase";
import { Id } from "../../../../../shared/domain/Id";
import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";
import { CreateResponse } from "./CreateResponse";
import { Debt } from "../../../domain/debt";
import { Description } from "../../../domain/description";
import { DebtsStatus } from "../../../domain/debtsStatus";
import { Balance } from "../../../domain/balance";
import { GetByIdUseCase } from "../../envelopes/getById/GetByIdUseCase";
import { Envelope } from "../../../domain/envelope";
import { EnvelopeMap } from "../../../mappers/envelopeMap";
import { TransactionsStatus } from "../../../domain/transactionsStatus";
import { Transaction } from "../../../domain/transaction";
import { PaymentMethod } from "../../../domain/paymentMethod";
import { TransactionsType } from "../../../domain/transactionsType";

export class CreateUseCase implements UseCase<CreateDTO, Promise<CreateResponse>> {
  private repo: ITransactionRepo;
  private getEnvelopeByIdUseCase: GetByIdUseCase;

  constructor(repo: ITransactionRepo,getEnvelopeByIdUseCase: GetByIdUseCase) {
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
    
    const envelopeOrError = await this.getEnvelopeByIdUseCase.execute({userId:new UniqueEntityID(request.userId),envelopeId:new UniqueEntityID(request.envelopeId)})
    
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
    const paymentMethod: PaymentMethod= request.paymentMethod;
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

      await this.repo.save(transaction);

      return right(Result.ok<void>())

    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as CreateResponse;
    }
  }
}