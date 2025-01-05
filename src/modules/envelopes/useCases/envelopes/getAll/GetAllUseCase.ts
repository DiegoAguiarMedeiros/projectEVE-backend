import { AppError } from "../../../../../shared/core/AppError";
import { Either, Result, right } from "../../../../../shared/core/Result";
import { UseCase } from "../../../../../shared/core/UseCase";
import { Envelope } from "../../../domain/envelope";
import { IEnvelopeRepo } from "../../../repos/EnvelopeRepo";
import { GetAllDTO } from "./GetAllDTO";
import { GetAllResponse } from "./GetAllResponse";



export class GetAllUseCase implements UseCase<string, Promise<GetAllResponse>> {
    private envelopeRepo: IEnvelopeRepo;

    constructor(envelopeRepo: IEnvelopeRepo) {
        this.envelopeRepo = envelopeRepo;
    }
    async execute(id: string): Promise<GetAllResponse> {
        const envelopes = await this.envelopeRepo.getAll(id);

        return right(Result.ok<GetAllDTO>({
            envelopes
        }));
    }

}