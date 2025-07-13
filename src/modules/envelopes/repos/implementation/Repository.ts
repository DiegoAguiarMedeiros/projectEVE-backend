
import { Envelopes } from "../../domain/Envelopes";
import { EnvelopesMap as Mapper } from "../../mappers";
import { Interface } from "../Interface";

export class Repository implements Interface {

    private models: any;
    private model: any;

    constructor(models: any) {
        this.models = models;
        this.model = this.models.Envelopes;
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
    async update(id: string, data: Envelopes): Promise<boolean> {
        const rawData = await Mapper.toPersistence(data);
        const [updatedRows] = await this.model.update(
            rawData,
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
    async getAll(id: string, page?: number, pageSize?: number, orderBy?: string, order?: string): Promise<Envelopes[]> {
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
            order: ['order'],
        });
        return data.map((item: any) => Mapper.toDomain(item));
    }

    async getOnlyById(id: string): Promise<Envelopes | null> {
        const data = await this.model.findOne({
            where: {
                id
            },
            raw: true,
        });
        return Mapper.toDomain(data) ?? null;
    }
    async getById(id: string, userId: string): Promise<Envelopes | null> {
        console.log("id", id)
        console.log("userId", userId)
        const data = await this.model.findOne({
            where: {
                id,
                user_id: userId,
            },
            raw: true,
        });
        console.log("data", data)
        return Mapper.toDomain(data) ?? null;
    }

    async getByName(name: string, userId: string): Promise<Envelopes | null> {
        const data = await this.model.findOne({
            where: {
                name,
                user_id: userId,
            },
            raw: true,
        });
        return Mapper.toDomain(data) ?? null;
    }

    async create(data: Envelopes): Promise<void> {
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