import { IEnvelopeRepo } from "../EnvelopeRepo";
import { Envelope } from "../../domain/envelope";
import { EnvelopeMap } from "../../mappers/envelopeMap";

export class EnvelopeRepo implements IEnvelopeRepo {

    private models: any;

    constructor(models: any) {
        this.models = models;
    }
    async checkName(name: string, userId: string): Promise<boolean> {
        const EnvelopeModel = this.models.Envelopes;
        const envelope = await EnvelopeModel.findOne({
            where: {
                name,
                user_id: userId,
            },
            raw: true,
        });
        return !!envelope;
    }
    async updateName(id: string, userId: string, name: string): Promise<boolean> {
        const EnvelopeModel = this.models.Envelopes;

        // Atualiza o nome onde o id e o userId correspondem
        const [updatedRows] = await EnvelopeModel.update(
            { name }, // Campos a serem atualizados
            {
                where: {
                    id,
                    user_id: userId,
                },
            }
        );
        if (updatedRows === 0) {
            return false;
        }
        return true;
    }
    async getAll(id: string): Promise<Envelope[]> {
        const EnvelopeModel = this.models.Envelopes;
        return await EnvelopeModel.findAll({
            where: {
                user_id: id,
            },
        });
    }

    async getById(id: string, userId: string): Promise<Envelope | null> {
        const EnvelopeModel = this.models.Envelopes;
        const envelope = await EnvelopeModel.findOne({
            where: {
                id,
                user_id: userId,
            },
            raw: true,
        });
        return envelope ?? null;
    }

    async save(Envelope: Envelope): Promise<void> {
        const EnvelopeModel = this.models.Envelopes;
        const rawEnvelope = await EnvelopeMap.toPersistence(Envelope);
        await EnvelopeModel.create(rawEnvelope);
    }

    async delete(id: string): Promise<void> {
        const EnvelopeModel = this.models.Envelopes;
        await EnvelopeModel.destroy({
            where: {
                id,
            },
        });
    }

}