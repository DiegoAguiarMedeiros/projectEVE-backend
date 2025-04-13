import { UseCase } from "../../../../domain/shared/core/UseCase";
import { left, right, Result } from "../../../../domain/shared/core/Result";
import { AppError } from "../../../../domain/shared/core/AppError";
import { GetByIdDTOResponse, GetByIdDTOResquest } from "./GetByIdDTO";
import { GetByIdErrors } from "./GetByIdErrors";
import { GetByIdResponse } from "./GetByIdResponse";
import { Interface as IDebtRepo} from "../../../../domain/repositories/debt/Interface";
import { Debt } from "../../../../domain/entities/debt/Debt";


export class GetByIdUseCase implements UseCase<GetByIdDTOResquest, Promise<GetByIdResponse>> {
    private repo: IDebtRepo;
    constructor(repo: IDebtRepo) {
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