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
import { DebtMap } from "../../../mappers/debtMap";
import { IDebtRepo } from "../../../repos/DebtsRepo";
import { UpdateDTO } from "./UpdateDTO";
import { UpdateErrors } from "./UpdateErrors";
import { UpdateResponse } from "./UpdateResponse";


export class UpdateUseCase implements UseCase<UpdateDTO, Promise<UpdateResponse>> {
    private repo: IDebtRepo;

    constructor(repo: IDebtRepo) {
        this.repo = repo;
    }
    async execute(request: UpdateDTO): Promise<Promise<UpdateResponse>> {
        try {

            const debt = DebtMap.toDomain(await this.repo.getById(request.id.toString(), request.userId.toString()));
            if (!debt) {
                return left(
                    new UpdateErrors.NotFound(request.id.toString())
                ) as UpdateResponse;
            }

            const DescriptionOrError = Description.create({ description: request.description ? request.description : debt.description.value });
            DescriptionOrError.isFailure ? console.error(DescriptionOrError.getErrorValue()) : '';

            const AmountOrError = Balance.create({ balance: request.amount ? request.amount : debt.amount.value });
            AmountOrError.isFailure ? console.error(AmountOrError.getErrorValue()) : '';

            const InstallmentsTotalOrError = Balance.create({ balance: request.installments_total ? request.installments_total : debt.installments_total.value });
            InstallmentsTotalOrError.isFailure ? console.error(InstallmentsTotalOrError.getErrorValue()) : '';

            const InstallmentsPaidOrError = Balance.create({ balance: request.installments_paid ? request.installments_paid : debt.installments_paid.value });
            InstallmentsPaidOrError.isFailure ? console.error(InstallmentsPaidOrError.getErrorValue()) : '';

            const CreditCardIdOrError = Id.create(new UniqueEntityID(request.creditCardId ? request.creditCardId : debt.creditCardId.value));
            CreditCardIdOrError.isFailure ? console.error(CreditCardIdOrError.getErrorValue()) : '';

            const EvelopeIdOrError = Id.create(new UniqueEntityID(request.envelopeId ? request.envelopeId : debt.envelopeId.value));
            EvelopeIdOrError.isFailure ? console.error(EvelopeIdOrError.getErrorValue()) : '';

            const dtoResult = Result.combine([
                DescriptionOrError, AmountOrError, CreditCardIdOrError, EvelopeIdOrError, InstallmentsTotalOrError, InstallmentsPaidOrError
            ]);

            if (dtoResult.isFailure) {
                return left(Result.fail<void>(dtoResult.getErrorValue())) as UpdateResponse;
            }

            const creditCardId: Id = CreditCardIdOrError.getValue();
            const envelopeId: Id = EvelopeIdOrError.getValue();
            const description: Description = DescriptionOrError.getValue();
            const amount: Balance = AmountOrError.getValue();
            const installments_total: Balance = InstallmentsTotalOrError.getValue();
            const installments_paid: Balance = InstallmentsPaidOrError.getValue();
            const dueDate: Date = request.dueDate ? request.dueDate : debt.dueDate;
            const status: DebtsStatus = request.status ? request.status : debt.status;




            if (request.creditCardId) debt.updateCreditCardId(creditCardId)
            if (request.envelopeId) debt.updateEnvelopeId(envelopeId)
            if (request.description) debt.updateDescription(description)
            if (request.amount) debt.updateAmount(amount)
            if (request.installments_total) debt.updateInstallmentsTotal(installments_total)
            if (request.installments_paid) debt.updateInstallmentsPaid(installments_paid)
            if (request.dueDate) debt.updateDueDate(dueDate)
            if (request.status) debt.updateStatus(status)

            request.creditCardId ? request.creditCardId : debt.creditCardId.value


            const updateDebt = await this.repo.update(debt.id.value, request.userId.toString(), debt);
            if (updateDebt) return right(Result.ok<void>()) as UpdateResponse;

            return left(
                new UpdateErrors.UpdateError(debt.id.value)
            ) as UpdateResponse;


        } catch (err) {
            return left(new AppError.UnexpectedError(err)) as UpdateResponse;
        }
    }

}