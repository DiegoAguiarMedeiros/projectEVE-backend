import { AppError } from "../../../../../shared/core/AppError";
import { Either, left, Result, right } from "../../../../../shared/core/Result";
import { UseCase } from "../../../../../shared/core/UseCase";
import { Id } from "../../../../../shared/domain/Id";
import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";
import { Balance } from "../../../domain/balance";
import { Debt } from "../../../domain/debt";
import { DebtsStatus } from "../../../domain/debtsStatus";
import { Description } from "../../../domain/description";
import { Flag } from "../../../domain/flag";
import { Flags } from "../../../domain/flags";
import { Name } from "../../../domain/name";
import { PaymentMethod } from "../../../domain/paymentMethod";
import { TransactionsStatus } from "../../../domain/transactionsStatus";
import { TransactionsType } from "../../../domain/transactionsType";
import { TransactionMap } from "../../../mappers/transactionMap";
import { ITransactionRepo } from "../../../repos/TransactionsRepo";
import { UpdateDTO } from "./UpdateDTO";
import { UpdateErrors } from "./UpdateErrors";
import { UpdateResponse } from "./UpdateResponse";


export class UpdateUseCase implements UseCase<UpdateDTO, Promise<UpdateResponse>> {
    private repo: ITransactionRepo;

    constructor(repo: ITransactionRepo) {
        this.repo = repo;
    }
    async execute(request: UpdateDTO): Promise<Promise<UpdateResponse>> {
        try {

            const transaction = TransactionMap.toDomain(await this.repo.getById(request.id.toString(), request.userId.toString()));
            if (!transaction) {
                return left(
                    new UpdateErrors.NotFound(request.id.toString())
                ) as UpdateResponse;
            }

            const DescriptionOrError = Description.create({ description: request.description ? request.description : transaction.description.value });
            DescriptionOrError.isFailure ? console.error(DescriptionOrError.getErrorValue()) : '';

            const AmountOrError = Balance.create({ balance: request.amount ? request.amount : transaction.amount.value });
            AmountOrError.isFailure ? console.error(AmountOrError.getErrorValue()) : '';

            const CreditCardIdOrError = Id.create(new UniqueEntityID(request.creditCardId ? request.creditCardId : transaction.creditCardId?.value));
            CreditCardIdOrError.isFailure ? console.error(CreditCardIdOrError.getErrorValue()) : '';

            const EvelopeIdOrError = Id.create(new UniqueEntityID(request.envelopeId ? request.envelopeId : transaction.envelopeId.value));
            EvelopeIdOrError.isFailure ? console.error(EvelopeIdOrError.getErrorValue()) : '';

            const dtoResult = Result.combine([
                DescriptionOrError, AmountOrError, CreditCardIdOrError, EvelopeIdOrError
            ]);

            if (dtoResult.isFailure) {
                return left(Result.fail<void>(dtoResult.getErrorValue())) as UpdateResponse;
            }

            const creditCardId: Id = CreditCardIdOrError.getValue();
            const envelopeId: Id = EvelopeIdOrError.getValue();
            const description: Description = DescriptionOrError.getValue();
            const amount: Balance = AmountOrError.getValue();
            const paymentMethod: PaymentMethod = request.paymentMethod ? request.paymentMethod : transaction.paymentMethod;
            const date: Date = request.date ? request.date : transaction.date;
            const type: TransactionsType = request.type ? request.type : transaction.type;
            const status: TransactionsStatus = request.status ? request.status : transaction.status;

            if (request.creditCardId == '' ) {
                transaction.updateCreditCardId()
            } else {
                transaction.updateCreditCardId(creditCardId)
            }
            if (request.envelopeId) transaction.updateEnvelopeId(envelopeId)
            if (request.description) transaction.updateDescription(description)
            if (request.amount) transaction.updateAmount(amount)
            if (request.paymentMethod) transaction.updatePaymentMethod(paymentMethod)
            if (request.date) transaction.updateDate(date)
            if (request.type) transaction.updateType(type)
            if (request.status) transaction.updateStatus(status)

            const updateDebt = await this.repo.update(transaction.id.value, request.userId.toString(), transaction);
            if (updateDebt) return right(Result.ok<void>()) as UpdateResponse;

            return left(
                new UpdateErrors.UpdateError(transaction.id.value)
            ) as UpdateResponse;


        } catch (err) {
            return left(new AppError.UnexpectedError(err)) as UpdateResponse;
        }
    }

}