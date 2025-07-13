
import { Balance } from "../../../../shared/domain/Balance";
import { Description } from "../../../../shared/domain/Description";
import { CreateResponse } from "./CreateResponse";
import { UseCase } from "../../../../shared/core/UseCase";
import { left, Result, right } from "../../../../shared/core/Result";
import { AppError } from "../../../../shared/core/AppError";
import { Interface as ITransactionsRepo } from "../../repos/Interface";
import { CreateDTO } from "../../dtos";
import { Transactions, PaymentMethod, TransactionsStatus, TransactionsProps } from "../../domain";
import { TransactionsType } from "../../domain/TransactionsType";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";
import { Id } from "../../../../shared/domain/Id";

export class CreateUseCase implements UseCase<CreateDTO, Promise<CreateResponse>> {
  private repo: ITransactionsRepo;

  constructor(repo: ITransactionsRepo) {
    this.repo = repo;
  }

  async execute(request: CreateDTO): Promise<CreateResponse> {

    const EnvelopeIdOrError = Id.create(new UniqueEntityID(request.envelopeId));
    const DescriptionOrError = Description.create({ description: request.description });
    const AmountOrError = Balance.create({ balance: request.amount });

    const dtoResult = Result.combine([
      EnvelopeIdOrError, DescriptionOrError, AmountOrError
    ]);

    if (dtoResult.isFailure) {
      return left(Result.fail<void>(dtoResult.getErrorValue())) as CreateResponse;
    }

    const envelopeId: Id = EnvelopeIdOrError.getValue();
    const description: Description = DescriptionOrError.getValue();
    const amount: Balance = AmountOrError.getValue();
    const date: Date = request.date;
    const type: TransactionsType = request.type;
    const status: TransactionsStatus = request.status;
    const paymentMethod: PaymentMethod = request.paymentMethod;

    try {

      const transactionOrError: Result<Transactions> = Transactions.create({
        envelopeId,
        description,
        amount,
        date,
        type,
        status,
        paymentMethod
      });

      if (transactionOrError.isFailure) {
        return left(
          Result.fail<Transactions>(transactionOrError.getErrorValue().toString())
        ) as CreateResponse;
      }

      const transaction: Transactions = transactionOrError.getValue();

      console.log("transaction", transaction)
      await this.repo.create(transaction);

      return right(Result.ok<Transactions>(transaction))

    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as CreateResponse;
    }
  }
}