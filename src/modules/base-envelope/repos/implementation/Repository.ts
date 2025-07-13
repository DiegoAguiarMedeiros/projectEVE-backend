
import { BaseEnvelope } from "../../domain/BaseEnvelope";
import { Interface } from "../Interface";
import { BaseEnvelopeMap as Mapper } from "../../mappers";

export class Repository implements Interface {

    private models: any;
    private model: any;

    constructor(models: any) {
        this.models = models;
        this.model = this.models.BaseEnvelope;
    }

    async getAll(): Promise<BaseEnvelope[]> {
        const data = await this.model.findAll({
            attributes: ['id', 'name','order','color'],
            order:['order'],
            raw: true,
        });
        return data.map((e: any) => Mapper.toDomain(e));;
    }

    async save(envelope: BaseEnvelope): Promise<void> {
        const rawData = await Mapper.toPersistence(envelope);
        await this.model.create(rawData);
    }

}