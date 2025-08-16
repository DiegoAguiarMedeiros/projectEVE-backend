import { UseCase } from "../../../../shared/core/UseCase";
import { Interface as IEnvelopesRepo } from "../../repos/Interface";
import { GetAllResponse } from "./GetAllResponse";
import { Result, right } from "../../../../shared/core/Result";
import { EnvelopesDTO } from "../../dtos";
import { EnvelopesMap as Mapper } from "../../mappers";


export class GetAllUseCase implements UseCase<{ id: string, year: number, month: number }, Promise<GetAllResponse>> {
    private envelopeRepo: IEnvelopesRepo;

    constructor(envelopeRepo: IEnvelopesRepo) {
        this.envelopeRepo = envelopeRepo;
    }
    async execute(request: { id: string, year: number, month: number }): Promise<GetAllResponse> {
        const data = await this.envelopeRepo.getAllMonthly(request.id, request.year,request.month);
        return right(Result.ok<EnvelopesDTO[]>(
            data.map((item: any) => Mapper.toDTO(item))
        ));
    }

}