import { UseCase } from "../../../../../shared/core/UseCase";
import { IInvestmentsRepo } from "../../../repos/InvestmentsRepo";
import { Either, left, Result, right } from "../../../../../shared/core/Result";
import { AppError } from "../../../../../shared/core/AppError";
import { GetByIdDTOResquest } from "./GetByIdDTO";
import { GetByIdErrors } from "./GetByIdErrors";
import { Debt } from "../../../domain/debt";
import { GetByIdResponse } from "./GetByIdResponse";


export class GetByIdUseCase implements UseCase<GetByIdDTOResquest, Promise<GetByIdResponse>> {
    private repo: IInvestmentsRepo;
    constructor(repo: IInvestmentsRepo) {
        this.repo = repo;
    }
    async execute(request: GetByIdDTOResquest): Promise<GetByIdResponse> {
        const debt = await this.repo.getById(request.Id.toString(), request.userId.toString());

        if (!debt) {
            return left(
                new GetByIdErrors.NotFound(request.Id.toString())
            ) as GetByIdResponse;
        }


        return right(Result.ok<Debt>(
            debt
        ));
    }
}