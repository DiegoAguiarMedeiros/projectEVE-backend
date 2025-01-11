import { AppError } from "../../../../../shared/core/AppError";
import { Either, left, Result, right } from "../../../../../shared/core/Result";
import { UseCase } from "../../../../../shared/core/UseCase";
import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";
import { Envelope } from "../../../domain/envelope";
import { EnvelopeMap } from "../../../mappers/envelopeMap";
import { ITransactionRepo } from "../../../repos/TransactionsRepo";
import { GetAllDTO } from "./GetAllDTO";
import { GetAllResponse } from "./GetAllResponse";


export class GetAllUseCase implements UseCase<string, Promise<GetAllResponse>> {
    private repo: ITransactionRepo;

    constructor(repo: ITransactionRepo) {
        this.repo = repo;
    }
    async execute(id: string): Promise<GetAllResponse> {

        const transaction = await this.repo.getAll(id);

        return right(Result.ok<GetAllDTO>({
            transaction
        }));
    }

}