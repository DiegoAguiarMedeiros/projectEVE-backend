import { UseCase } from "../../../../domain/shared/core/UseCase";
import { Interface as IEnvelopeRepo } from "../../../../domain/repositories/envelope/Interface";
import { GetAllResponse } from "./GetAllResponse";
import { Result, right } from "../../../../domain/shared/core/Result";
import { EnvelopeDTO } from "../../../../domain/dto/envelope";
import { EnvelopeMap as Mapper } from "../../../../shared/mappers/envelope";


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