
import { FixedExpense } from "../../../../domain/entities/fixedExpense/FixedExpense";
import { Interface as IFixedExpensesRepo} from "../../../../domain/repositories/fixedExpense/Interface";
import { left, Result, right } from "../../../../domain/shared/core/Result";
import { UseCase } from "../../../../domain/shared/core/UseCase";
import { GetByIdDTOResquest } from "./GetByIdDTO";
import { GetByIdErrors } from "./GetByIdErrors";
import { GetByIdResponse } from "./GetByIdResponse";


export class GetByIdUseCase implements UseCase<GetByIdDTOResquest, Promise<GetByIdResponse>> {
    private repo: IFixedExpensesRepo;
    constructor(repo: IFixedExpensesRepo) {
        this.repo = repo;
    }
    async execute(request: GetByIdDTOResquest): Promise<GetByIdResponse> {
        const data = await this.repo.getById(request.Id.toString(), request.userId.toString());

        if (!data) {
            return left(
                new GetByIdErrors.NotFound(request.Id.toString())
            ) as GetByIdResponse;
        }

        return right(Result.ok<FixedExpense>(
            data
        ));
    }
}