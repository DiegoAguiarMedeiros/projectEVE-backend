import { CreditCardMap as Mapper } from "../../../../shared/mappers/creditCard";
import { CreditCard } from "../../../entities/creditCard/CreditCard";
import { Interface } from "../Interface";

export class Repository implements Interface {

    private models: any;
    private model: any;

    constructor(models: any) {
        this.models = models;
        this.model = this.models.CreditCard;
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
    async update(id: string, userId: string, data: CreditCard): Promise<boolean> {
        const [updatedRows] = await this.model.update(
            data, 
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

    async getAll(id: string, page?: number, pageSize?: number, orderBy?: string, order?: string): Promise<CreditCard[]> {
        const limit = pageSize || undefined;
        const offset = page ? (page - 1) * (pageSize || 10) : 0;
        const allowedColumns = ["name", "flag"];
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
        return data.map((e: any) => Mapper.toDomain(e));
    }


    async getById(id: string, userId: string): Promise<CreditCard | null> {
        const data = await this.model.findOne({
            where: {
                id,
                user_id: userId,
            },
            raw: true,
        });
        return Mapper.toDomain(data) ?? null;
    }

    async create(data: CreditCard): Promise<void> {
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