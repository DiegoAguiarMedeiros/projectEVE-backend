
import { GetByIdDTO } from "../../../../budgeting/envelope/dtos";
import { Interface as IMonthlyEnvelopeRepo } from "../../repos/Interface";
import { left, Result, right } from "../../../../../shared/core/Result";
import { UseCase } from "../../../../../shared/core/UseCase";
import { GetByIdErrors } from "./GetByIdErrors";
import { GetByIdResponse } from "./GetByIdResponse";
import { MonthlyEnvelope } from "../../domain";




export class GetByIdUseCase implements UseCase<GetByIdDTO, Promise<GetByIdResponse>> {
    private repo: IMonthlyEnvelopeRepo;
    constructor(repo: IMonthlyEnvelopeRepo) {
        this.repo = repo;
    }
    async execute(request: GetByIdDTO): Promise<GetByIdResponse> {
        const envelope = await this.repo.getById(request.id, request.userId);

        if (!envelope) {
            return left(
                new GetByIdErrors.NotFound(request.id)
            ) as GetByIdResponse;
        }


        return right(Result.ok<MonthlyEnvelope>(
            envelope
        ));
    }
}