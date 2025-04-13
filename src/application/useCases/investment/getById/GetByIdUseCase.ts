
import { Investment } from "../../../../domain/entities/investment/Investment";
import { Interface as IInvestmentsRepo} from "../../../../domain/repositories/investment/Interface";
import { left, Result, right } from "../../../../domain/shared/core/Result";
import { UseCase } from "../../../../domain/shared/core/UseCase";
import { GetByIdDTOResquest } from "./GetByIdDTO";
import { GetByIdErrors } from "./GetByIdErrors";
import { GetByIdResponse } from "./GetByIdResponse";


export class GetByIdUseCase implements UseCase<GetByIdDTOResquest, Promise<GetByIdResponse>> {
    private repo: IInvestmentsRepo;
    constructor(repo: IInvestmentsRepo) {
        this.repo = repo;
    }
    async execute(request: GetByIdDTOResquest): Promise<GetByIdResponse> {
        const data = await this.repo.getById(request.Id.toString(), request.userId.toString());

        if (!data) {
            return left(
                new GetByIdErrors.NotFound(request.Id.toString())
            ) as GetByIdResponse;
        }

        return right(Result.ok<Investment>(
            data
        ));
    }
}