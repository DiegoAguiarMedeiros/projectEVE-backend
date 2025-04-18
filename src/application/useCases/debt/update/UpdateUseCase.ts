import { DebtsStatus } from "../../../../domain/entities/debt/DebtsStatus";
import { Interface as IDebtRepo} from "../../../../domain/repositories/debt/Interface";
import { Balance } from "../../../../domain/shared/Balance";
import { AppError } from "../../../../domain/shared/core/AppError";
import { left, right, Result } from "../../../../domain/shared/core/Result";
import { UseCase } from "../../../../domain/shared/core/UseCase";
import { Description } from "../../../../domain/shared/Description";
import { Id } from "../../../../domain/shared/Id";
import { UniqueEntityID } from "../../../../domain/shared/UniqueEntityID";
import { DebtMap } from "../../../../shared/mappers/debt";
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

            const InstallmentsTotalOrError = Balance.create({ balance: request.installmentsTotal ? request.installmentsTotal : debt.installmentsTotal.value });
            InstallmentsTotalOrError.isFailure ? console.error(InstallmentsTotalOrError.getErrorValue()) : '';

            const InstallmentsPaidOrError = Balance.create({ balance: request.installmentsPaid ? request.installmentsPaid : debt.installmentsPaid.value });
            InstallmentsPaidOrError.isFailure ? console.error(InstallmentsPaidOrError.getErrorValue()) : '';

            const EvelopeIdOrError = Id.create(new UniqueEntityID(request.envelopeId ? request.envelopeId : debt.envelopeId.value));
            EvelopeIdOrError.isFailure ? console.error(EvelopeIdOrError.getErrorValue()) : '';

            const dtoResult = Result.combine([
                DescriptionOrError, AmountOrError,  EvelopeIdOrError, InstallmentsTotalOrError, InstallmentsPaidOrError
            ]);

            if (dtoResult.isFailure) {
                return left(Result.fail<void>(dtoResult.getErrorValue())) as UpdateResponse;
            }

            const envelopeId: Id = EvelopeIdOrError.getValue();
            const description: Description = DescriptionOrError.getValue();
            const amount: Balance = AmountOrError.getValue();
            const installmentsTotal: Balance = InstallmentsTotalOrError.getValue();
            const installmentsPaid: Balance = InstallmentsPaidOrError.getValue();
            const paymentDay: Date = request.paymentDay ? request.paymentDay : debt.paymentDay;
            const status: DebtsStatus = request.status ? request.status : debt.status;



            if (request.envelopeId) debt.updateEnvelopeId(envelopeId)
            if (request.description) debt.updateDescription(description)
            if (request.amount) debt.updateAmount(amount)
            if (request.installmentsTotal) debt.updateInstallmentsTotal(installmentsTotal)
            if (request.installmentsPaid) debt.updateInstallmentsPaid(installmentsPaid)
            if (request.paymentDay) debt.updatepaymentDay(paymentDay)
            if (request.status) debt.updateStatus(status)

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