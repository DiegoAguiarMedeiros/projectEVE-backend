import { EnvelopeMap as Mapper } from "../../../../shared/mappers/envelope";
import { Envelope } from "../../../entities/envelope/Envelope";
import { Interface } from "../Interface";

export class Repository implements Interface {

    private models: any;
    private model: any;

    constructor(models: any) {
        this.models = models;
        this.model = this.models.Envelope;
    }

    async checkName(name: string, userId: string): Promise<boolean> {
        const data = await this.model.findOne({
            where: {
                name,
                user_id: userId,
            },
            raw: true,
        });
        return !!data;
    }
    async update(id: string, data: Envelope): Promise<boolean> {

        const [updatedRows] = await this.model.update(
            { name: data.name }, 
            {
                where: {
                    id,
                },
            }
        );
        if (updatedRows === 0) {
            return false;
        }
        return true;
    }
    async getAll(id: string, page?: number, pageSize?: number, orderBy?: string, order?: string): Promise<Envelope[]> {
        const limit = pageSize || undefined;
        const offset = page ? (page - 1) * (pageSize || 10) : 0;
        const allowedColumns = ["name", "balance", "active", "created_at"];
        const allowedOrders = ["asc", "desc"];

        const safeOrderBy = allowedColumns.includes(orderBy || "") ? orderBy : "created_at";
        const safeOrder = allowedOrders.includes(order || "") ? order : "desc";

        const data = await this.model.findAll({
            where: {
                user_id: id,
            },
            limit: limit,
            offset: offset,
            order: [[safeOrderBy, safeOrder]],
        });
        return data.map((creditCard: any) => Mapper.toDomain(creditCard));
    }

    async getById(id: string, userId: string): Promise<Envelope | null> {
        const data = await this.model.findOne({
            where: {
                id,
                user_id: userId,
            },
            raw: true,
        });
        return Mapper.toDomain(data) ?? null;
    }
    
    async getByName(name: string, userId: string): Promise<Envelope | null> {
        const data = await this.model.findOne({
            where: {
                name,
                user_id: userId,
            },
            raw: true,
        });
        return data ?? null;
    }

    async create(data: Envelope): Promise<void> {
        const rawData = await Mapper.toPersistence(data);
        await this.model.create(rawData);
    }

    async delete(id: string): Promise<void> {
        await this.model.destroy({
            where: {
                id,
            },
        });
    }

}