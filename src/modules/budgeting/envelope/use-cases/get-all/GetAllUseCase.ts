import { UseCase } from "../../../../../shared/core/UseCase";
import { Interface as IEnvelopeRepo } from "../../repos/Interface";
import { GetAllResponse } from "./GetAllResponse";
import { Result, right } from "../../../../../shared/core/Result";
import { EnvelopeDTO } from "../../dtos";
import { EnvelopeMap as Mapper } from "../../mappers";


export class GetAllUseCase implements UseCase<string, Promise<GetAllResponse>> {
    private envelopeRepo: IEnvelopeRepo;

    constructor(envelopeRepo: IEnvelopeRepo) {
        this.envelopeRepo = envelopeRepo;
    }
    async execute(id: string): Promise<GetAllResponse> {
        const data = await this.envelopeRepo.getAll(id);

        return right(Result.ok<EnvelopeDTO[]>(
            data.map((item: any) => Mapper.toDTO(item))
        ));
    }

}