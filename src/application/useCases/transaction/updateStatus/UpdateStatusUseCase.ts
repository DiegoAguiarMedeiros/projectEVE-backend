import { PaymentMethod } from "../../../../domain/entities/transaction/PaymentMethod";
import { TransactionStatus } from "../../../../domain/entities/transaction/TransactionStatus";
import { TransactionType } from "../../../../domain/entities/transaction/TransactionType";
import { Interface as ITransactionRepo } from "../../../../domain/repositories/transaction/Interface";
import { Interface as IEnvelopeRepo } from "../../../../domain/repositories/envelope/Interface";
import { Balance } from "../../../../domain/shared/Balance";
import { left, Result, right } from "../../../../domain/shared/core/Result";
import { UseCase } from "../../../../domain/shared/core/UseCase";
import { Description } from "../../../../domain/shared/Description";
import { Id } from "../../../../domain/shared/Id";
import { UniqueEntityID } from "../../../../domain/shared/UniqueEntityID";
import { AppError } from "../../../../domain/shared/core/AppError";
import { TransactionMap } from "../../../../shared/mappers/transaction";
import { UpdateStatusErrors } from "./UpdateStatusErrors";
import { UpdateStatusResponse } from "./UpdateStatusResponse";
import { UpdateStatusDTO } from "../../../../domain/dto/transaction";
import { EnvelopeDTO } from "../../../../domain/dto/envelope";
import { EnvelopeMap } from "../../../../shared/mappers/envelope";


export class UpdateStatusUseCase implements UseCase<UpdateStatusDTO, Promise<UpdateStatusResponse>> {
    private repo: ITransactionRepo;
    private envelopeRepo: IEnvelopeRepo;

    constructor(repo: ITransactionRepo, envelopeRepo: IEnvelopeRepo) {
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
            
            const status: TransactionStatus = data.fieldUpdate.status ? data.fieldUpdate.status : transaction.status;

            if (data.fieldUpdate.status) transaction.updateStatus(status)

            const updateDebt = await this.repo.updateStatus(transaction.id.value,  transaction.status);
            if (updateDebt) return right(Result.ok<void>()) as UpdateStatusResponse;

            return left(
                new UpdateStatusErrors.UpdateError(transaction.id.value)
            ) as UpdateStatusResponse;


        } catch (err) {
            return left(new AppError.UnexpectedError(err)) as UpdateStatusResponse;
        }
    }

}