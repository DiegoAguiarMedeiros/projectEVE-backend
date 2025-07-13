import { UseCase } from "../../../../shared/core/UseCase";
import { Interface as IEnvelopesRepo } from "../../repos/Interface";
import { GetAllResponse } from "./GetAllResponse";
import { Result, right } from "../../../../shared/core/Result";
import { EnvelopesDTO } from "../../dtos";
import { EnvelopesMap as Mapper } from "../../mappers";


export class GetAllUseCase implements UseCase<string, Promise<GetAllResponse>> {
    private envelopeRepo: IEnvelopesRepo;

    constructor(envelopeRepo: IEnvelopesRepo) {
        this.envelopeRepo = envelopeRepo;
    }
    async execute(id: string): Promise<GetAllResponse> {
        const data = await this.envelopeRepo.getAll(id);

        return right(Result.ok<EnvelopesDTO[]>(
            data.map((item: any) => Mapper.toDTO(item))
        ));
    }

}