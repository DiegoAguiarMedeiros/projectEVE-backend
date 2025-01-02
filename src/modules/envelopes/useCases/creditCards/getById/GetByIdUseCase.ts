import { UseCase } from "../../../../../shared/core/UseCase";
import { ICreditCardRepo } from "../../../repos/CreditCardRepo";
import { Either, left, Result, right } from "../../../../../shared/core/Result";
import { AppError } from "../../../../../shared/core/AppError";
import { GetByIdDTOResponse, GetByIdDTOResquest } from "./GetByIdDTO";
import { GetByIdErrors } from "./GetByIdErrors";
import { Envelope } from "../../../domain/envelope";
import { CreditCard } from "../../../domain/creditCard";

type Response = Either<
    AppError.UnexpectedError,
    Result<CreditCard>
>


export class GetByIdUseCase implements UseCase<GetByIdDTOResquest, Promise<Response>> {
    private repo: ICreditCardRepo;
    constructor(repo: ICreditCardRepo) {
        this.repo = repo;
    }
    async execute(request: GetByIdDTOResquest): Promise<Response> {
        const creditcard = await this.repo.getById(request.Id.toString(), request.userId.toString());

        if (!creditcard) {
            return left(
                new GetByIdErrors.NotFound(request.Id.toString())
            ) as Response;
        }


        return right(Result.ok<CreditCard>(
            creditcard
        ));
    }
}