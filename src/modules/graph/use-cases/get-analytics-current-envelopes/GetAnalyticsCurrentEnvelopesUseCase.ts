import { Interface as IEnvelopesRepo } from "../../../envelopes/repos/Interface";
import { Result, right } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { GetAnalyticsCurrentEnvelopesResponse } from "./GetAnalyticsCurrentEnvelopesResponse";
import { AnalyticsCurrentEnvelopesDTO } from "../../dtos";


export class GetAnalyticsCurrentEnvelopesUseCase implements UseCase<{ id: string; year: number, month: number }, Promise<GetAnalyticsCurrentEnvelopesResponse>> {
    private envelopesRepo: IEnvelopesRepo;

    constructor( envelopesRepo: IEnvelopesRepo) {
        this.envelopesRepo = envelopesRepo;
    }
    async execute({ id, year, month }: { id: string, year: number, month: number }): Promise<GetAnalyticsCurrentEnvelopesResponse> {

        const data = await this.envelopesRepo.getAnalyticsCurrentEnvelopes(id, year, month);

        return right(Result.ok<AnalyticsCurrentEnvelopesDTO>(data));
    }

}