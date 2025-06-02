
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

  constructor(repo: ITransactionRepo) {
    this.repo = repo;
  }

  async execute(request: CreateDTO): Promise<CreateResponse> {

    const DescriptionOrError = Description.create({ description: request.description });
    const AmountOrError = Balance.create({ balance: request.amount });
    const CreditCardIdOrError = Id.create(new UniqueEntityID(request.creditCardId));
    const DebtIdOrError = Id.create(new UniqueEntityID(request.debtId));
    const MonthlyEnvelopeIdOrError = Id.create(new UniqueEntityID(request.monthlyEnvelopeId));

    const dtoResult = Result.combine([
      DescriptionOrError, AmountOrError, CreditCardIdOrError,MonthlyEnvelopeIdOrError, DebtIdOrError
    ]);

    if (dtoResult.isFailure) {
      return left(Result.fail<void>(dtoResult.getErrorValue())) as CreateResponse;
    }

    const creditCardId: Id = CreditCardIdOrError.getValue();
    const debtId: Id = DebtIdOrError.getValue();
    const monthlyEnvelopeId: Id = MonthlyEnvelopeIdOrError.getValue();
    const description: Description = DescriptionOrError.getValue();
    const amount: Balance = AmountOrError.getValue();
    const paymentMethod: PaymentMethod = request.paymentMethod;
    const date: Date = request.date;
    const type: TransactionType = request.type;
    const status: TransactionStatus = request.status;

    try {

      const transactionProps: TransactionProps = {
        description,
        amount,
        paymentMethod,
        date,
        type,
        status,
        monthlyEnvelopeId,
        
      }

      if (request.creditCardId) transactionProps.creditCardId = creditCardId;
      if (request.debtId) transactionProps.debtId = debtId;

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