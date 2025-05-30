import { TransactionStatus } from "../../domain";
import { Interface as ITransactionRepo } from "../../repos/Interface";
import { Interface as IEnvelopeRepo } from "../../../../budgeting/envelope/repos/Interface";
import { Balance } from "../../../../../shared/domain/Balance";
import { left, Result, right } from "../../../../../shared/core/Result";
import { UseCase } from "../../../../../shared/core/UseCase";
import { Description } from "../../../../../shared/domain/Description";
import { Id } from "../../../../../shared/domain/Id";
import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";
import { AppError } from "../../../../../shared/core/AppError";
import { TransactionMap } from "../../mappers";
import { UpdateStatusErrors } from "./UpdateStatusErrors";
import { UpdateStatusResponse } from "./UpdateStatusResponse";
import { UpdateStatusDTO } from "../../dtos";
import { EnvelopeDTO } from "../../../../budgeting/envelope/dtos";
import { EnvelopeMap } from "../../../../budgeting/envelope/mappers";


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