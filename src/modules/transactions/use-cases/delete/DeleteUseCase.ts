import { DeleteDTO } from "../../dtos";
import { Interface as ITransactionRepo} from "../../repos/Interface";
import { Repository as IEnvelopeRepo } from "../../../envelopes/repos/implementation/Repository";
import { Interface as IDebtRepo } from "../../../debts/repos/Interface";
import { AppError } from "../../../../shared/core/AppError";
import { left, Result, right } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { DeleteErrors } from "./DeleteErrors";
import { DeleteResponse } from "./DeleteResponse";



export class DeleteUseCase implements UseCase<DeleteDTO, Promise<DeleteResponse>> {
    private repo: ITransactionRepo;
    private envelopeRepo: IEnvelopeRepo;
    private debtRepo?: IDebtRepo;

    constructor(repo: ITransactionRepo, envelopeRepo: IEnvelopeRepo, debtRepo?: IDebtRepo) {
        this.repo = repo;
        this.envelopeRepo = envelopeRepo;
        this.debtRepo = debtRepo;
    }
    async execute(request: DeleteDTO): Promise<DeleteResponse> {

        try {
            const transaction = await this.repo.getById(request.id.toString(), request.userId.toString());

            if (!transaction) {
                return left(
                    new DeleteErrors.NotFound(request.id.toString())
                ) as DeleteResponse;
            }

            if (transaction.status === 'transaction.status.completed') {
                const year = transaction.referenceYear;
                const month = transaction.referenceMonth;
                const amount = Number(transaction.amount.value);
                if (amount > 0) {
                    const delta = transaction.type === "Debit" ? amount : -amount;
                    await this.envelopeRepo.adjustAmount(
                        transaction.envelopeId.value, delta, year, month
                    );
                }

                if (transaction.debtId?.value && this.debtRepo) {
                    await this.debtRepo.updateInstallmentsPaid(transaction.debtId.value, -1);
                }
            }

            await this.repo.delete(request.id.toString());
            return right(Result.ok<void>()) as DeleteResponse;

        } catch (err) {
            return left(new AppError.UnexpectedError(err)) as DeleteResponse;
        }
    }

}