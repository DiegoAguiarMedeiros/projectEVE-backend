import { GetByIdDTO } from "../../../../domain/dto/income";
import { Income } from "../../../../domain/entities/income/Income";
import { Interface as IIncomesRepo } from "../../../../domain/repositories/income/Interface";
import { left, right, Result } from "../../../../domain/shared/core/Result";
import { UseCase } from "../../../../domain/shared/core/UseCase";
import { GetByIdErrors } from "./GetByIdErrors";
import { GetByIdResponse } from "./GetByIdResponse";

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