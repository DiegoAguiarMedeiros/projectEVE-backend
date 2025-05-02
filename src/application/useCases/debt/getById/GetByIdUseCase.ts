import { UseCase } from "../../../../domain/shared/core/UseCase";
import { left, right, Result } from "../../../../domain/shared/core/Result";
import { GetByIdErrors } from "./GetByIdErrors";
import { GetByIdResponse } from "./GetByIdResponse";
import { Interface as IDebtRepo} from "../../../../domain/repositories/debt/Interface";
import { Debt } from "../../../../domain/entities/debt/Debt";
import { GetByIdDTO } from "../../../../domain/dto/debt";


export class GetByIdUseCase implements UseCase<GetByIdDTO, Promise<GetByIdResponse>> {
    private repo: IDebtRepo;
    constructor(repo: IDebtRepo) {
        this.repo = repo;
    }
    async execute(request: GetByIdDTO): Promise<GetByIdResponse> {
        const debt = await this.repo.getById(request.id, request.userId);

        if (!debt) {
            return left(
                new GetByIdErrors.NotFound(request.id)
            ) as GetByIdResponse;
        }


        return right(Result.ok<Debt>(
            debt
        ));
    }
}