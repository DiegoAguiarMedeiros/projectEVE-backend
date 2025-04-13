import { UseCase } from "../../../../domain/shared/core/UseCase";
import { Interface as IEnvelopeRepo} from "../../../../domain/repositories/envelope/Interface";
import { GetAllDTO } from "./GetAllDTO";
import { GetAllResponse } from "./GetAllResponse";
import { Result, right } from "../../../../domain/shared/core/Result";



export class GetAllUseCase implements UseCase<string, Promise<GetAllResponse>> {
    private envelopeRepo: IEnvelopeRepo;

    constructor(envelopeRepo: IEnvelopeRepo) {
        this.envelopeRepo = envelopeRepo;
    }
    async execute(id: string): Promise<GetAllResponse> {
        const envelopes = await this.envelopeRepo.getAll(id);

        return right(Result.ok<GetAllDTO>({
            envelopes
        }));
    }

}