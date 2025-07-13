import { TransactionsStatus } from "../../domain";
import { Interface as ITransactionsRepo } from "../../repos/Interface";
import { Interface as IEnvelopeRepo } from "../../../envelopes/repos/Interface";
import { left, Result, right } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { AppError } from "../../../../shared/core/AppError";
import { UpdateStatusErrors } from "./UpdateStatusErrors";
import { UpdateStatusResponse } from "./UpdateStatusResponse";
import { UpdateStatusDTO } from "../../dtos";


export class UpdateStatusUseCase implements UseCase<UpdateStatusDTO, Promise<UpdateStatusResponse>> {
    private repo: ITransactionsRepo;
    private envelopeRepo: IEnvelopeRepo;

    constructor(repo: ITransactionsRepo, envelopeRepo: IEnvelopeRepo) {
        this.repo = repo;
        this.envelopeRepo = envelopeRepo;
    }
    
    async execute(data: UpdateStatusDTO): Promise<Promise<UpdateStatusResponse>> {
        try {

            const transaction = await this.repo.getById(data.request.id.toString(), data.request.userId.toString());
            if (!transaction) {
                return left(
                    new UpdateStatusErrors.NotFound(data.request.id.toString())
                ) as UpdateStatusResponse;
            }
            
            const status: TransactionsStatus = data.fieldUpdate.status ? data.fieldUpdate.status : transaction.status;

            if (data.fieldUpdate.status) transaction.updateStatus(status)

            const updateDebt = await this.repo.updateStatus(transaction.id.toString(),  transaction.status);
            if (updateDebt) return right(Result.ok<void>()) as UpdateStatusResponse;

            return left(
                new UpdateStatusErrors.UpdateError(transaction.id.toString())
            ) as UpdateStatusResponse;


        } catch (err) {
            return left(new AppError.UnexpectedError(err)) as UpdateStatusResponse;
        }
    }

}