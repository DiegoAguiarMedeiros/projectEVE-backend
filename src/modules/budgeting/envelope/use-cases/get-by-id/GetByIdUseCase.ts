
import { GetByIdDTO } from "../../dtos";
import { Interface as IEnvelopeRepo } from "../../repos/Interface";
import { left, Result, right } from "../../../../../shared/core/Result";
import { UseCase } from "../../../../../shared/core/UseCase";
import { GetByIdErrors } from "./GetByIdErrors";
import { GetByIdResponse } from "./GetByIdResponse";
import { Envelope } from "../../domain/Envelope";




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