import { GetByIdDTO } from "../../dtos";
import { Interface as IIncomesRepo } from "../../repos/Interface";
import { left, right, Result } from "../../../../../shared/core/Result";
import { UseCase } from "../../../../../shared/core/UseCase";
import { GetByIdErrors } from "./GetByIdErrors";
import { GetByIdResponse } from "./GetByIdResponse";
import { Income } from "../../domain";

export class GetByIdUseCase implements UseCase<GetByIdDTO, Promise<GetByIdResponse>> {
    private repo: IIncomesRepo;
    constructor(repo: IIncomesRepo) {
        this.repo = repo;
    }
    async execute(request: GetByIdDTO): Promise<GetByIdResponse> {
        const income = await this.repo.getById(request.id, request.userId);

        if (!income) {
            return left(
                new GetByIdErrors.NotFound(request.id)
            ) as GetByIdResponse;
        }

        return right(Result.ok<Income>(
            income
        ));
    }
}