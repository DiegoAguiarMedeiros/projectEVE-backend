import { AppError } from "../../../../../shared/core/AppError";
import { Either, Result, right } from "../../../../../shared/core/Result";
import { UseCase } from "../../../../../shared/core/UseCase";
import { ICreditCardRepo } from "../../../repos/CreditCardRepo";
import { GetAllCreditCardsDTOResponse } from "./GetAllCreditCardsDTO";

type Response = Either<
    AppError.UnexpectedError,
    Result<GetAllCreditCardsDTOResponse>
>

export class GetAllCreditCardsUseCase implements UseCase<string, Promise<Response>> {
    private CreditCardRepo: ICreditCardRepo;

    constructor(CreditCardRepo: ICreditCardRepo) {
        this.CreditCardRepo = CreditCardRepo;
    }
    async execute(id: string): Promise<Response> {
        const creditCards = await this.CreditCardRepo.getAll(id);

        return right(Result.ok<GetAllCreditCardsDTOResponse>({
            creditCards
        }));
    }

}