import { UseCase } from "../../../../domain/shared/core/UseCase";
import { left, right, Result } from "../../../../domain/shared/core/Result";
import { GetByIdErrors } from "./GetByIdErrors";
import { GetByIdResponse } from "./GetByIdResponse";
import { Interface as ICreditCardRepo} from "../../../../domain/repositories/creditCard/Interface";
import { CreditCard } from "../../../../domain/entities/creditCard/CreditCard";
import { GetByIdDTO } from "../../../../domain/dto/creditCard";



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