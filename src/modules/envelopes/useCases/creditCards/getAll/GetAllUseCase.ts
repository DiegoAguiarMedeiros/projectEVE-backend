import { AppError } from "../../../../../shared/core/AppError";
import { Either, Result, right } from "../../../../../shared/core/Result";
import { UseCase } from "../../../../../shared/core/UseCase";
import { ICreditCardRepo } from "../../../repos/CreditCardRepo";
import { GetAllDTO } from "./GetAllDTO";
import { GetAllResponse } from "./GetAllResponse";


export class GetAllUseCase implements UseCase<string, Promise<GetAllResponse>> {
    private CreditCardRepo: ICreditCardRepo;

    constructor(CreditCardRepo: ICreditCardRepo) {
        this.CreditCardRepo = CreditCardRepo;
    }
    async execute(id: string): Promise<GetAllResponse> {
        const creditCards = await this.CreditCardRepo.getAll(id);

        return right(Result.ok<GetAllDTO>({
            creditCards
        }));
    }

}