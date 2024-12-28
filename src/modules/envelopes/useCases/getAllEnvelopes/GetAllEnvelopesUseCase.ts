import { AppError } from "../../../../shared/core/AppError";
import { Either, Result, right } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { Id } from "../../../../shared/domain/Id";
import { Envelope } from "../../domain/envelope";
import { IEnvelopeRepo } from "../../repos/EnvelopeRepo";
import { GetAllEnvelopesDTOResponse } from "./GetAllEnvelopesDTO";

type Response = Either<
    AppError.UnexpectedError,
    Result<GetAllEnvelopesDTOResponse>
>

export class GetAllEnvelopesUseCase implements UseCase<string, Promise<Response>> {
    private envelopeRepo: IEnvelopeRepo;

    constructor(envelopeRepo: IEnvelopeRepo) {
        this.envelopeRepo = envelopeRepo;
    }
    async execute(id: string): Promise<Response> {
        const envelopes = await this.envelopeRepo.getAll(id);

        return right(Result.ok<GetAllEnvelopesDTOResponse>({
            envelopes
        }));
    }

}