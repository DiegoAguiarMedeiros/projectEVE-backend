import { UseCase } from "../../../../../shared/core/UseCase";
import { IEnvelopeRepo } from "../../../repos/EnvelopeRepo";
import { Either, left, Result, right } from "../../../../../shared/core/Result";
import { AppError } from "../../../../../shared/core/AppError";
import { GetEnvelopeByIdDTOResponse, GetEnvelopeByIdDTOResquest } from "./GetEnvelopeByIdDTO";
import { GetEnvelopeByIdErrors } from "./GetEnvelopeByIdErrors";
import { Envelope } from "../../../domain/envelope";

type Response = Either<
    AppError.UnexpectedError,
    Result<Envelope>
>


export class GetEnvelopeByIdUseCase implements UseCase<GetEnvelopeByIdDTOResquest, Promise<Response>> {
    private envelopeRepo: IEnvelopeRepo;
    constructor(envelopeRepo: IEnvelopeRepo) {
        this.envelopeRepo = envelopeRepo;
    }
    async execute(request: GetEnvelopeByIdDTOResquest): Promise<Response> {
        const envelope = await this.envelopeRepo.getById(request.envelopeId.toString(), request.userId.toString());

        if (!envelope) {
            return left(
                new GetEnvelopeByIdErrors.EnvelopeNotFound(request.envelopeId.toString())
            ) as Response;
        }


        return right(Result.ok<Envelope>(
            envelope
        ));
    }
}