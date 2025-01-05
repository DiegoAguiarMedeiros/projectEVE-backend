import { UseCase } from "../../../../../shared/core/UseCase";
import { IIncomesRepo } from "../../../repos/IncomesRepo";
import { Either, left, Result, right } from "../../../../../shared/core/Result";
import { AppError } from "../../../../../shared/core/AppError";
import { GetByIdDTOResponse, GetByIdDTOResquest } from "./GetByIdDTO";
import { GetByIdErrors } from "./GetByIdErrors";
import { Debt } from "../../../domain/debt";
import { GetByIdResponse } from "./GetByIdResponse";
import { Income } from "../../../domain/income";


export class GetByIdUseCase implements UseCase<GetByIdDTOResquest, Promise<GetByIdResponse>> {
    private repo: IIncomesRepo;
    constructor(repo: IIncomesRepo) {
        this.repo = repo;
    }
    async execute(request: GetByIdDTOResquest): Promise<GetByIdResponse> {
        const income = await this.repo.getById(request.Id.toString(), request.userId.toString());

        if (!income) {
            return left(
                new GetByIdErrors.NotFound(request.Id.toString())
            ) as GetByIdResponse;
        }


        return right(Result.ok<Income>(
            income
        ));
    }
}