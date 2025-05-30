
import { UseCase } from "../../../../../shared/core/UseCase";
import { GetByIdErrors } from "./GetByIdErrors";
import { GetByIdResponse } from "./GetByIdResponse";
import { Interface as ITransactionRepo } from "../../repos/Interface";
import { left, Result, right } from "../../../../../shared/core/Result";
import { Transaction } from "../../domain";
import { GetByIdDTO } from "../../dtos";

export class GetByIdUseCase implements UseCase<GetByIdDTO, Promise<GetByIdResponse>> {
    private repo: ITransactionRepo;
    constructor(repo: ITransactionRepo) {
        this.repo = repo;
    }
    async execute(request: GetByIdDTO): Promise<GetByIdResponse> {
        const transaction = await this.repo.getById(request.id, request.userId);

        if (!transaction) {
            return left(
                new GetByIdErrors.NotFound(request.id)
            ) as GetByIdResponse;
        }


        return right(Result.ok<Transaction>(
            transaction
        ));
    }
}