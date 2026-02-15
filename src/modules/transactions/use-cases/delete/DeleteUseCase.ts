import { DeleteDTO } from "../../dtos";
import { Interface as ITransactionRepo} from "../../repos/Interface";
import { Repository as IEnvelopeRepo } from "../../../envelopes/repos/implementation/Repository";
import { AppError } from "../../../../shared/core/AppError";
import { left, Result, right } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { DeleteErrors } from "./DeleteErrors";
import { DeleteResponse } from "./DeleteResponse";



export class DeleteUseCase implements UseCase<DeleteDTO, Promise<DeleteResponse>> {
    private repo: ITransactionRepo;
    private envelopeRepo: IEnvelopeRepo;

    constructor(repo: ITransactionRepo, envelopeRepo: IEnvelopeRepo) {
        this.repo = repo;
        this.envelopeRepo = envelopeRepo;
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
                const year = transaction.date.getFullYear();
                const month = transaction.date.getMonth() + 1;
                const envelopeAmount = await this.envelopeRepo.getAmount(
                    transaction.envelopeId.value, year, month
                );

                if (envelopeAmount) {
                    let newAmount: number;
                    if (transaction.type === "Debit") {
                        newAmount = Number(envelopeAmount) + Number(transaction.amount.value);
                    } else {
                        newAmount = Number(envelopeAmount) - Number(transaction.amount.value);
                    }
                    await this.envelopeRepo.addAmount(
                        transaction.envelopeId.value, newAmount, year, month
                    );
                }
            }

            await this.repo.delete(request.id.toString());
            return right(Result.ok<void>()) as DeleteResponse;

        } catch (err) {
            return left(new AppError.UnexpectedError(err)) as DeleteResponse;
        }
    }

}