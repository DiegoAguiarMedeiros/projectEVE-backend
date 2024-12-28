import { IBaseEnvelopeRepo } from "../BaseEnvelopeRepo";
import { BaseEnvelope } from "../../domain/baseEnvelope";
import { BaseEnvelopeMap } from "../../mappers/baseEnvelopeMap";

export class BaseEnvelopeRepo implements IBaseEnvelopeRepo {

    private models: any;

    constructor(models: any) {
        this.models = models;
    }
    async getAll(): Promise<BaseEnvelope[]> {
        const EnvelopeModel = this.models.BaseEnvelopes;
        const baseEnvelopes = await EnvelopeModel.findAll({
            attributes: ['id', 'name'],
            raw: true,
        });
        return baseEnvelopes.map((e: any) => BaseEnvelopeMap.toDomain(e));;
    }

    async save(envelope: BaseEnvelope): Promise<void> {
        const EnvelopeModel = this.models.BaseEnvelopes;
        const rawEnvelope = await BaseEnvelopeMap.toPersistence(envelope);
        await EnvelopeModel.create(rawEnvelope);
    }

}