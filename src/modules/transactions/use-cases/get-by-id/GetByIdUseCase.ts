
import { UseCase } from "../../../../shared/core/UseCase";
import { GetByIdErrors } from "./GetByIdErrors";
import { GetByIdResponse } from "./GetByIdResponse";
import { Interface as ITransactionsRepo } from "../../repos/Interface";
import { left, Result, right } from "../../../../shared/core/Result";
import { Transactions } from "../../domain";
import { GetByIdDTO } from "../../dtos";

export class GetByIdUseCase implements UseCase<GetByIdDTO, Promise<GetByIdResponse>> {
    private repo: ITransactionsRepo;
    constructor(repo: ITransactionsRepo) {
        this.repo = repo;
    }
    async execute(request: GetByIdDTO): Promise<GetByIdResponse> {
        const transaction = await this.repo.getById(request.id, request.userId);

        if (!transaction) {
            return left(
                new GetByIdErrors.NotFound(request.id)
            ) as GetByIdResponse;
        }


        return right(Result.ok<Transactions>(
            transaction
        ));
    }
}