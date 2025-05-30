import { UseCase } from "../../../../../shared/core/UseCase";
import { Interface as IMonthlyEnvelopeRepo } from "../../repos/Interface";
import { GetAllResponse } from "./GetAllResponse";
import { Result, right } from "../../../../../shared/core/Result";
import { MonthlyEnvelopeDTO } from "../../dtos";
import { MonthlyEnvelopeMap as Mapper } from "../../mappers";


export class GetAllUseCase implements UseCase<string, Promise<GetAllResponse>> {
    private envelopeRepo: IMonthlyEnvelopeRepo;

    constructor(envelopeRepo: IMonthlyEnvelopeRepo) {
        this.envelopeRepo = envelopeRepo;
    }
    async execute(id: string): Promise<GetAllResponse> {
        const data = await this.envelopeRepo.getAll(id);

        return right(Result.ok<MonthlyEnvelopeDTO[]>(
            data.map((item: any) => Mapper.toDTO(item))
        ));
    }

}