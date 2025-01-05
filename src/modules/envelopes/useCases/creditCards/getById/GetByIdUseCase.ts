import { UseCase } from "../../../../../shared/core/UseCase";
import { ICreditCardRepo } from "../../../repos/CreditCardRepo";
import { Either, left, Result, right } from "../../../../../shared/core/Result";
import { AppError } from "../../../../../shared/core/AppError";
import { GetByIdDTOResponse, GetByIdDTOResquest } from "./GetByIdDTO";
import { GetByIdErrors } from "./GetByIdErrors";
import { Envelope } from "../../../domain/envelope";
import { CreditCard } from "../../../domain/creditCard";
import { GetByIdResponse } from "./GetByIdResponse";




export class GetByIdUseCase implements UseCase<GetByIdDTOResquest, Promise<GetByIdResponse>> {
    private repo: ICreditCardRepo;
    constructor(repo: ICreditCardRepo) {
        this.repo = repo;
    }
    async execute(request: GetByIdDTOResquest): Promise<GetByIdResponse> {
        const creditcard = await this.repo.getById(request.Id.toString(), request.userId.toString());

        if (!creditcard) {
            return left(
                new GetByIdErrors.NotFound(request.Id.toString())
            ) as GetByIdResponse;
        }


        return right(Result.ok<CreditCard>(
            creditcard
        ));
    }
}