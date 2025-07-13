
import { FixedExpense } from "../../domain/FixedExpense";
import { Interface as IFixedExpensesRepo} from "../../repos/Interface";
import { left, Result, right } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { GetByIdErrors } from "./GetByIdErrors";
import { GetByIdResponse } from "./GetByIdResponse";
import { GetByIdDTO } from "../../dtos";


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