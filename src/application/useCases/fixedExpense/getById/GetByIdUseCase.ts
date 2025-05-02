
import { GetByIdDTO } from "../../../../domain/dto/fixedExpense";
import { FixedExpense } from "../../../../domain/entities/fixedExpense/FixedExpense";
import { Interface as IFixedExpensesRepo} from "../../../../domain/repositories/fixedExpense/Interface";
import { left, Result, right } from "../../../../domain/shared/core/Result";
import { UseCase } from "../../../../domain/shared/core/UseCase";
import { GetByIdErrors } from "./GetByIdErrors";
import { GetByIdResponse } from "./GetByIdResponse";


export class GetByIdUseCase implements UseCase<GetByIdDTO, Promise<GetByIdResponse>> {
    private repo: IFixedExpensesRepo;
    constructor(repo: IFixedExpensesRepo) {
        this.repo = repo;
    }
    async execute(request: GetByIdDTO): Promise<GetByIdResponse> {
        const data = await this.repo.getById(request.id, request.userId);

        if (!data) {
            return left(
                new GetByIdErrors.NotFound(request.id)
            ) as GetByIdResponse;
        }

        return right(Result.ok<FixedExpense>(
            data
        ));
    }
}