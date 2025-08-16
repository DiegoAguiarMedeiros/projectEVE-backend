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

            const transaction = await this.repo.getById(data.request.id, data.request.userId);
            if (!transaction) {
                return left(
                    new UpdateStatusErrors.NotFound(data.request.id)
                ) as UpdateStatusResponse;
            }

            const status: TransactionsStatus = data.fieldUpdate.status ? data.fieldUpdate.status : transaction.status;

            if (data.fieldUpdate.status) transaction.updateStatus(status)

            const updateTransaction = await this.repo.updateStatus(transaction.id.toString(), transaction.status);

            if (updateTransaction) {

                const envelopesAmount = await this.envelopeRepo.getAmount(transaction.envelopeId.value, transaction.date.getFullYear(), transaction.date.getMonth() + 1);

                let amountToAdd:number = 0;
                if (envelopesAmount === null) {
                    amountToAdd = transaction.amount.value;

                    await this.envelopeRepo.createAmount(transaction.envelopeId.value, transaction.amount.value, transaction.date.getFullYear(), transaction.date.getMonth() + 1);
                } else {
                    if (transaction.type === "Debit") {
                        if (transaction.status === 'Completed') {
                            amountToAdd = Number(envelopesAmount) - Number(transaction.amount.value);
                        } else {
                            amountToAdd = Number(envelopesAmount) + Number(transaction.amount.value);
                        }
                    } else {
                        if (transaction.status === 'Completed') {
                            amountToAdd = Number(envelopesAmount) + Number(transaction.amount.value);
                        } else {
                            amountToAdd = Number(envelopesAmount) - Number(transaction.amount.value);
                        }
                    }
                }

                await this.envelopeRepo.addAmount(transaction.envelopeId.value, amountToAdd, transaction.date.getFullYear(), transaction.date.getMonth() + 1);
                return right(Result.ok<void>()) as UpdateStatusResponse;
            }

            return left(
                new UpdateStatusErrors.UpdateError(transaction.id.toString())
            ) as UpdateStatusResponse;


        } catch (err) {
            return left(new AppError.UnexpectedError(err)) as UpdateStatusResponse;
        }
    }

}