import { UpdateDTO } from "../../dtos";
import { Interface as IDebtRepo} from "../../repos/Interface";
import { Balance } from "../../../../shared/domain/Balance";
import { AppError } from "../../../../shared/core/AppError";
import { left, right, Result } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { Description } from "../../../../shared/domain/Description";
import { PaymentDay } from "../../../../shared/domain/PaymentDay";
import { DebtMap } from "../../mappers";
import { UpdateErrors } from "./UpdateErrors";
import { UpdateResponse } from "./UpdateResponse";
import { DebtsStatus } from "../../domain";


export class UpdateUseCase implements UseCase<UpdateDTO, Promise<UpdateResponse>> {
    private repo: IDebtRepo;

    constructor(repo: IDebtRepo) {
        this.repo = repo;
    }
    async execute(data: UpdateDTO): Promise<Promise<UpdateResponse>> {
        try {

            const debt = DebtMap.toDomain(await this.repo.getById(data.request.id.toString(), data.request.userId.toString()));
            if (!debt) {
                return left(
                    new UpdateErrors.NotFound(data.request.id.toString())
                ) as UpdateResponse;
            }

            const DescriptionOrError = Description.create({ description: data.fieldUpdate.description ? data.fieldUpdate.description : debt.description.value });
            DescriptionOrError.isFailure ? console.error(DescriptionOrError.getErrorValue()) : '';

            const AmountOrError = Balance.create({ balance: data.fieldUpdate.amount ? data.fieldUpdate.amount : debt.amount.value });
            AmountOrError.isFailure ? console.error(AmountOrError.getErrorValue()) : '';

            const InstallmentsTotalOrError = Balance.create({ balance: data.fieldUpdate.installmentsTotal ? data.fieldUpdate.installmentsTotal : debt.installmentsTotal.value });
            InstallmentsTotalOrError.isFailure ? console.error(InstallmentsTotalOrError.getErrorValue()) : '';

            const InstallmentsPaidOrError = Balance.create({ balance: data.fieldUpdate.installmentsPaid ? data.fieldUpdate.installmentsPaid : debt.installmentsPaid.value });
            InstallmentsPaidOrError.isFailure ? console.error(InstallmentsPaidOrError.getErrorValue()) : '';

            const PaymentDayOrError = PaymentDay.create({ paymentDay: data.fieldUpdate.paymentDay ? data.fieldUpdate.paymentDay : debt.paymentDay.value });
            PaymentDayOrError.isFailure ? console.error(PaymentDayOrError.getErrorValue()) : '';



            const dtoResult = Result.combine([
                DescriptionOrError, AmountOrError,  InstallmentsTotalOrError, InstallmentsPaidOrError, PaymentDayOrError
            ]);

            if (dtoResult.isFailure) {
                return left(Result.fail<void>(dtoResult.getErrorValue())) as UpdateResponse;
            }

            const description: Description = DescriptionOrError.getValue();
            const amount: Balance = AmountOrError.getValue();
            const installmentsTotal: Balance = InstallmentsTotalOrError.getValue();
            const installmentsPaid: Balance = InstallmentsPaidOrError.getValue();
            const paymentDay: PaymentDay = PaymentDayOrError.getValue();
            const status: DebtsStatus = data.fieldUpdate.status ? data.fieldUpdate.status : debt.status;



            if (data.fieldUpdate.description) debt.updateDescription(description)
            if (data.fieldUpdate.amount) debt.updateAmount(amount)
            if (data.fieldUpdate.installmentsTotal) debt.updateInstallmentsTotal(installmentsTotal)
            if (data.fieldUpdate.installmentsPaid) debt.updateInstallmentsPaid(installmentsPaid)
            if (data.fieldUpdate.paymentDay) debt.updatepaymentDay(paymentDay)
            if (data.fieldUpdate.status) debt.updateStatus(status)

            const updateDebt = await this.repo.update(data.request.id.toString(), debt);
            if (updateDebt) return right(Result.ok<void>()) as UpdateResponse;

            return left(
                new UpdateErrors.UpdateError(debt.id.value)
            ) as UpdateResponse;


        } catch (err) {
            return left(new AppError.UnexpectedError(err)) as UpdateResponse;
        }
    }

}