
import { Balance } from "../../../../shared/domain/Balance";
import { Description } from "../../../../shared/domain/Description";
import { CreateResponse } from "./CreateResponse";
import { UseCase } from "../../../../shared/core/UseCase";
import { left, Result, right } from "../../../../shared/core/Result";
import { AppError } from "../../../../shared/core/AppError";
import { Interface as ITransactionsRepo } from "../../repos/Interface";
import { Interface as IenvelopeRepo } from "../../../envelopes/repos/Interface";
import { CreateDTO } from "../../dtos";
import { Transactions, PaymentMethod, TransactionsStatus, TransactionsProps } from "../../domain";
import { TransactionsType } from "../../domain/TransactionsType";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";
import { Id } from "../../../../shared/domain/Id";
import { CreateErrors } from "./CreateErrors";

export class CreateUseCase implements UseCase<CreateDTO, Promise<CreateResponse>> {
  private repo: ITransactionsRepo;
  private envelopeRepo: IenvelopeRepo;
  constructor(repo: ITransactionsRepo, envelopeRepo: IenvelopeRepo) {
    this.repo = repo;
    this.envelopeRepo = envelopeRepo;
  }

  async execute(request: CreateDTO): Promise<CreateResponse> {

    const ProcessedIncomesIdOrError = Id.create(new UniqueEntityID(request.processedIncomesId ? request.processedIncomesId : undefined));
    const EnvelopeIdOrError = Id.create(new UniqueEntityID(request.envelopeId));
    const DescriptionOrError = Description.create({ description: request.description });
    const AmountOrError = Balance.create({ balance: request.amount });

    const dtoResult = Result.combine([
      EnvelopeIdOrError, DescriptionOrError, AmountOrError, ProcessedIncomesIdOrError
    ]);

    if (dtoResult.isFailure) {
      return left(Result.fail<void>(dtoResult.getErrorValue())) as CreateResponse;
    }

    const processedIncomesId: Id = ProcessedIncomesIdOrError.getValue();
    const envelopeId: Id = EnvelopeIdOrError.getValue();
    const description: Description = DescriptionOrError.getValue();
    const amount: Balance = AmountOrError.getValue();
    const date: Date = request.date;
    const type: TransactionsType = request.type;
    const status: TransactionsStatus = request.status;
    const paymentMethod: PaymentMethod = request.paymentMethod;

    try {

      const transactionOrError: Result<Transactions> = Transactions.create({
        processedIncomesId: request.processedIncomesId ? processedIncomesId : undefined,
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




      await this.repo.create(transaction);
      if (request.status === 'Completed' && request.amount > 0) {

        const envelopes = await this.envelopeRepo.getOnlyById(request.envelopeId);
        if (!envelopes) {
          return left(new CreateErrors.EnvelopeNotFound(request.envelopeId));
        }
        
        const envelopesAmount = await this.envelopeRepo.getAmount(request.envelopeId, request.date.getFullYear(), request.date.getMonth() + 1);
        
        let amountToAdd = 0;
        if (envelopesAmount === null) {
          amountToAdd = request.amount;

          await this.envelopeRepo.createAmount(request.envelopeId, request.amount, request.date.getFullYear(), request.date.getMonth() + 1);
        } else {

          if (request.type === "Debit") {
            amountToAdd = envelopesAmount - request.amount;
          } else {

            amountToAdd = envelopesAmount + request.amount;
          }
        }
        await this.envelopeRepo.addAmount(request.envelopeId, amountToAdd, request.date.getFullYear(), request.date.getMonth() + 1);
      }


      return right(Result.ok<Transactions>(transaction))

    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as CreateResponse;
    }
  }
}