import { UseCase } from "../../../../domain/shared/core/UseCase";
import { left, right, Result } from "../../../../domain/shared/core/Result";
import { AppError } from "../../../../domain/shared/core/AppError";
import { GetByIdDTOResponse, GetByIdDTOResquest } from "./GetByIdDTO";
import { GetByIdErrors } from "./GetByIdErrors";
import { GetByIdResponse } from "./GetByIdResponse";
import { Interface as ICreditCardRepo} from "../../../../domain/repositories/creditCard/Interface";
import { CreditCard } from "../../../../domain/entities/creditCard/CreditCard";




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