
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
            attributes: ['id', 'name', 'order', 'color', 'percentage'],
            order: ['order'],
            raw: true,
        });
        return data.map((e: any) => Mapper.toDomain(e));;
    }

    async getById(id: string): Promise<BaseEnvelope | null> {
        const data = await this.model.findOne({ where: { id }, raw: true });
        if (!data) return null;
        return Mapper.toDomain(data);
    }

    async save(envelope: BaseEnvelope): Promise<void> {
        const rawData = await Mapper.toPersistence(envelope);
        await this.model.create(rawData);
    }

    async update(id: string, data: { name?: string; color?: string; order?: number; percentage?: number }): Promise<void> {
        const updateData: any = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (data.color !== undefined) updateData.color = data.color;
        if (data.order !== undefined) updateData.order = data.order;
        if (data.percentage !== undefined) updateData.percentage = data.percentage;
        await this.model.update(updateData, { where: { id } });
    }

    async delete(id: string): Promise<void> {
        await this.model.destroy({ where: { id } });
    }

}