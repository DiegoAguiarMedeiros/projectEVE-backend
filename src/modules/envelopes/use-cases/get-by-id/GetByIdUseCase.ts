
import { GetByIdDTO } from "../../dtos";
import { Interface as IEnvelopesRepo } from "../../repos/Interface";
import { left, Result, right } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { GetByIdErrors } from "./GetByIdErrors";
import { GetByIdResponse } from "./GetByIdResponse";
import { Envelopes } from "../../domain/Envelopes";




export class GetByIdUseCase implements UseCase<GetByIdDTO, Promise<GetByIdResponse>> {
    private repo: IEnvelopesRepo;
    constructor(repo: IEnvelopesRepo) {
        this.repo = repo;
    }
    async execute(request: GetByIdDTO): Promise<GetByIdResponse> {
        const envelope = await this.repo.getById(request.id, request.userId);

        if (!envelope) {
            return left(
                new GetByIdErrors.NotFound(request.id)
            ) as GetByIdResponse;
        }


        return right(Result.ok<Envelopes>(
            envelope
        ));
    }
}