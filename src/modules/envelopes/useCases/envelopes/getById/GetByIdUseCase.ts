import { UseCase } from "../../../../../shared/core/UseCase";
import { IEnvelopeRepo } from "../../../repos/EnvelopeRepo";
import { Either, left, Result, right } from "../../../../../shared/core/Result";
import { AppError } from "../../../../../shared/core/AppError";
import { GetByIdDTOResponse, GetByIdDTOResquest } from "./GetByIdDTO";
import { GetByIdErrors } from "./GetByIdErrors";
import { Envelope } from "../../../domain/envelope";

type Response = Either<
    AppError.UnexpectedError,
    Result<Envelope>
>


export class GetByIdUseCase implements UseCase<GetByIdDTOResquest, Promise<Response>> {
    private repo: IEnvelopeRepo;
    constructor(repo: IEnvelopeRepo) {
        this.repo = repo;
    }
    async execute(request: GetByIdDTOResquest): Promise<Response> {
        const envelope = await this.repo.getById(request.envelopeId.toString(), request.userId.toString());

        if (!envelope) {
            return left(
                new GetByIdErrors.NotFound(request.envelopeId.toString())
            ) as Response;
        }


        return right(Result.ok<Envelope>(
            envelope
        ));
    }
}