import { IEnvelopeRepo } from "../EnvelopeRepo";
import { Envelope } from "../../domain/envelope";
import { EnvelopeMap } from "../../mappers/envelopeMap";

export class MongoEnvelopeRepo implements IEnvelopeRepo {

    private models: any;

    constructor(models: any) {
        this.models = models;
    }

    async save(envelope: Envelope): Promise<void> {
        const EnvelopeModel = this.models.envelopeModel;
        const rawEnvelope = await EnvelopeMap.toPersistence(envelope);
        await EnvelopeModel.create(rawEnvelope);
    }

}