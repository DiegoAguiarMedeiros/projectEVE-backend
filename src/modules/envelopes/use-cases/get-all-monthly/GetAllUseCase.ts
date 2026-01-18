import { UseCase } from "../../../../shared/core/UseCase";
import { Interface as IEnvelopesRepo } from "../../repos/Interface";
import { GetAllResponse } from "./GetAllResponse";
import { Result, right } from "../../../../shared/core/Result";
import { EnvelopesDTO } from "../../dtos";
import { EnvelopesMap as Mapper } from "../../mappers";
import { Envelopes } from "../../domain/Envelopes";
import { Percentage } from "../../../../shared/domain/Percentage";


export class GetAllUseCase implements UseCase<{ id: string, year: number, month: number }, Promise<GetAllResponse>> {
    private envelopeRepo: IEnvelopesRepo;

    constructor(envelopeRepo: IEnvelopesRepo) {
        this.envelopeRepo = envelopeRepo;
    }
    async execute(request: { id: string, year: number, month: number }): Promise<GetAllResponse> {
        const data = await this.envelopeRepo.getAllMonthly(request.id, request.year, request.month);
        const mappedData = await Promise.all(
            data.map(async (item: Envelopes) => {
                const usedPercent = await this.envelopeRepo.getUsedByEnvelopeID(item.id.toString(), request.year, request.month);
                console.log("usedPercent", usedPercent)
                const PercentageOrError = Percentage.create({ percentage: usedPercent });
                if (!PercentageOrError.isFailure) {
                    console.log(item.name.value, PercentageOrError.getValue())
                    item.updateUsed(PercentageOrError.getValue())
                }
                return Mapper.toDTO(item);
            })
        );
        return right(Result.ok<EnvelopesDTO[]>(mappedData));
    }

}