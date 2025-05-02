
import { GetByIdDTO } from "../../../../domain/dto/envelope";
import { Envelope } from "../../../../domain/entities/envelope/Envelope";
import { Interface as IEnvelopeRepo } from "../../../../domain/repositories/envelope/Interface";
import { left, Result, right } from "../../../../domain/shared/core/Result";
import { UseCase } from "../../../../domain/shared/core/UseCase";
import { GetByIdErrors } from "./GetByIdErrors";
import { GetByIdResponse } from "./GetByIdResponse";




export class GetByIdUseCase implements UseCase<GetByIdDTO, Promise<GetByIdResponse>> {
    private repo: IEnvelopeRepo;
    constructor(repo: IEnvelopeRepo) {
        this.repo = repo;
    }
    async execute(request: GetByIdDTO): Promise<GetByIdResponse> {
        const envelope = await this.repo.getById(request.id, request.userId);

        if (!envelope) {
            return left(
                new GetByIdErrors.NotFound(request.id)
            ) as GetByIdResponse;
        }


        return right(Result.ok<Envelope>(
            envelope
        ));
    }
}