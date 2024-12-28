import { IEnvelopeRepo } from "../EnvelopeRepo";
import { Envelope } from "../../domain/envelope";
import { EnvelopeMap } from "../../mappers/envelopeMap";

export class EnvelopeRepo implements IEnvelopeRepo {

    private models: any;

    constructor(models: any) {
        this.models = models;
    }
    async getAll(id: string): Promise<Envelope[]> {
        const EnvelopeModel = this.models.Envelopes;
        return await EnvelopeModel.findAll({
            where: {
                user_id: id,
            },
        });
    }

    async save(Envelope: Envelope): Promise<void> {
        const EnvelopeModel = this.models.Envelopes;
        const rawEnvelope = await EnvelopeMap.toPersistence(Envelope);
        await EnvelopeModel.create(rawEnvelope);
    }

}