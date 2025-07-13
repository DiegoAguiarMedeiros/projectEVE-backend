import { UseCase } from "../../../../shared/core/UseCase";
import { left, right, Result } from "../../../../shared/core/Result";
import { GetByIdErrors } from "./GetByIdErrors";
import { GetByIdResponse } from "./GetByIdResponse";
import { Interface as ICreditCardRepo } from "../../repos/Interface";
import { GetByIdDTO } from "../../dtos";
import { CreditCard } from "../../domain";



export class GetByIdUseCase implements UseCase<GetByIdDTO, Promise<GetByIdResponse>> {
    private repo: ICreditCardRepo;
    constructor(repo: ICreditCardRepo) {
        this.repo = repo;
    }
    async execute(request: GetByIdDTO): Promise<GetByIdResponse> {
        const creditcard = await this.repo.getById(request.id, request.userId);

        if (!creditcard) {
            return left(
                new GetByIdErrors.NotFound(request.id)
            ) as GetByIdResponse;
        }


        return right(Result.ok<CreditCard>(
            creditcard
        ));
    }
}