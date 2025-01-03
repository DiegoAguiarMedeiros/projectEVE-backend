import { UseCase } from "../../../../../shared/core/UseCase";
import { IDebtRepo } from "../../../repos/DebtsRepo";
import { Either, left, Result, right } from "../../../../../shared/core/Result";
import { AppError } from "../../../../../shared/core/AppError";
import { GetByIdDTOResponse, GetByIdDTOResquest } from "./GetByIdDTO";
import { GetByIdErrors } from "./GetByIdErrors";
import { Debt } from "../../../domain/debt";

type Response = Either<
    AppError.UnexpectedError,
    Result<Debt>
>


export class GetByIdUseCase implements UseCase<GetByIdDTOResquest, Promise<Response>> {
    private repo: IDebtRepo;
    constructor(repo: IDebtRepo) {
        this.repo = repo;
    }
    async execute(request: GetByIdDTOResquest): Promise<Response> {
        const debt = await this.repo.getById(request.Id.toString(), request.userId.toString());

        if (!debt) {
            return left(
                new GetByIdErrors.NotFound(request.Id.toString())
            ) as Response;
        }


        return right(Result.ok<Debt>(
            debt
        ));
    }
}