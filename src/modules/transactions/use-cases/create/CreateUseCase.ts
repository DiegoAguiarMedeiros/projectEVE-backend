
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
    const CreditCardIdOrError = request.creditCardId ? Id.create(new UniqueEntityID(request.creditCardId)) : null;
    const DebtIdOrError = request.debtId ? Id.create(new UniqueEntityID(request.debtId)) : null;
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
    const transactionDate: Date = new Date(request.date);
    const date: Date = transactionDate;
    const type: TransactionsType = request.type;
    const status: TransactionsStatus = request.status;
    const paymentMethod: PaymentMethod = request.paymentMethod;

    try {

      const envelope = request.userId
        ? await this.envelopeRepo.getById(request.envelopeId, request.userId)
        : await this.envelopeRepo.getOnlyById(request.envelopeId);

      if (!envelope) {
        return left(new CreateErrors.EnvelopeNotFound(request.envelopeId));
      }

      const creditCardId = CreditCardIdOrError ? CreditCardIdOrError.getValue() : undefined;

      const debtId = DebtIdOrError ? DebtIdOrError.getValue() : undefined;

      const transactionOrError: Result<Transactions> = Transactions.create({
        processedIncomesId: request.processedIncomesId ? processedIncomesId : undefined,
        creditCardId: request.creditCardId ? creditCardId : undefined,
        debtId: request.debtId ? debtId : undefined,
        envelopeId,
        description,
        amount,
        date,
        type,
        status,
        paymentMethod,
        isTranslatable: request.isTranslatable ?? false
      });

      if (transactionOrError.isFailure) {
        return left(
          Result.fail<Transactions>(transactionOrError.getErrorValue().toString())
        ) as CreateResponse;
      }

      const transaction: Transactions = transactionOrError.getValue();




      if (request.type === 'Debit' && !request.debtId) {
        const year = transactionDate.getFullYear();
        const month = transactionDate.getMonth() + 1;
        const currentBalance = await this.envelopeRepo.getAmount(request.envelopeId, year, month);

        if (currentBalance !== null) {
          const pendingDebitsTotal = await this.repo.getTotalPendingDebitsByEnvelope(request.envelopeId, year, month);
          if (pendingDebitsTotal + Number(request.amount) > Number(currentBalance)) {
            return left(new CreateErrors.ExceedsEnvelopeBudget());
          }
        }
      }

      await this.repo.create(transaction);
      if (request.status === 'transaction.status.completed' && request.amount > 0) {
        const reqAmount = Number(request.amount);
        const delta = request.type === "Debit" ? -reqAmount : reqAmount;
        await this.envelopeRepo.adjustAmount(
          request.envelopeId,
          delta,
          transactionDate.getFullYear(),
          transactionDate.getMonth() + 1
        );
      }


      return right(Result.ok<Transactions>(transaction))

    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as CreateResponse;
    }
  }
}