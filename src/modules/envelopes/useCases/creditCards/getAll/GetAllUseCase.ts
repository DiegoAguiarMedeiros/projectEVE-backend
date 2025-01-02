import { AppError } from "../../../../../shared/core/AppError";
import { Either, Result, right } from "../../../../../shared/core/Result";
import { UseCase } from "../../../../../shared/core/UseCase";
import { ICreditCardRepo } from "../../../repos/CreditCardRepo";
import { GetAllDTOResponse } from "./GetAllDTO";

type Response = Either<
    AppError.UnexpectedError,
    Result<GetAllDTOResponse>
>

export class GetAllUseCase implements UseCase<string, Promise<Response>> {
    private CreditCardRepo: ICreditCardRepo;

    constructor(CreditCardRepo: ICreditCardRepo) {
        this.CreditCardRepo = CreditCardRepo;
    }
    async execute(id: string): Promise<Response> {
        const creditCards = await this.CreditCardRepo.getAll(id);

        return right(Result.ok<GetAllDTOResponse>({
            creditCards
        }));
    }

}