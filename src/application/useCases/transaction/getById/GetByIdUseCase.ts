
import { UseCase } from "../../../../domain/shared/core/UseCase";
import { GetByIdDTOResquest } from "./GetByIdDTO";
import { GetByIdErrors } from "./GetByIdErrors";
import { GetByIdResponse } from "./GetByIdResponse";
import { Interface as ITransactionRepo } from "../../../../domain/repositories/transaction/Interface";
import { left, Result, right } from "../../../../domain/shared/core/Result";
import { Transaction } from "../../../../domain/entities/transaction/Transaction";

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