import { UseCase } from "../../../../../shared/core/UseCase";
import { ITransactionRepo } from "../../../repos/TransactionsRepo";
import { Either, left, Result, right } from "../../../../../shared/core/Result";
import { AppError } from "../../../../../shared/core/AppError";
import { GetByIdDTOResponse, GetByIdDTOResquest } from "./GetByIdDTO";
import { GetByIdErrors } from "./GetByIdErrors";
import { GetByIdResponse } from "./GetByIdResponse";
import { Transaction } from "../../../domain/transaction";


export class GetByIdUseCase implements UseCase<GetByIdDTOResquest, Promise<GetByIdResponse>> {
    private repo: ITransactionRepo;
    constructor(repo: ITransactionRepo) {
        this.repo = repo;
    }
    async execute(request: GetByIdDTOResquest): Promise<GetByIdResponse> {
        const transaction = await this.repo.getById(request.Id.toString(), request.userId.toString());

        if (!transaction) {
            return left(
                new GetByIdErrors.NotFound(request.Id.toString())
            ) as GetByIdResponse;
        }


        return right(Result.ok<Transaction>(
            transaction
        ));
    }
}