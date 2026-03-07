import { Op, Sequelize } from "sequelize";
import { Interface } from "../Interface";
import { DebtMap as Mapper } from "../../mappers";
import { Debt } from "../../domain";

export class Repository implements Interface {

    private models: any;
    private model: any;

    constructor(models: any) {
        this.models = models;
        this.model = this.models.Debts;
    }
    async getTotal(envelopeId: string): Promise<number> {
        return await this.model.sum('amount', {
            where: { envelope_id: envelopeId }
        });
    }

    async update(id: string, data: Debt): Promise<boolean> {
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

    async getAll(id: string, page?: number, pageSize?: number, orderBy?: string, order?: string): Promise<Debt[]> {
        const limit = pageSize || undefined;
        const offset = page ? (page ) * (pageSize || 10) : 0;
        const allowedColumns = ["description", "amount", "installments_total", "installments_paid", "payment_day", "status", "created_at"];
        const allowedOrders = ["asc", "desc"];
        const envelopes = await this.models.Envelopes.findAll({
            where: { user_id: id },
            attributes: ['id'],
            raw: true,
        });
        const envelopeIds = envelopes.map((env: any) => env.id);
        const safeOrderBy = allowedColumns.includes(orderBy || "") ? orderBy : "created_at";
        const safeOrder = allowedOrders.includes(order || "") ? order : "desc";
        const data = await this.model.findAll({
            where: {
                envelope_id: {
                    [Op.in]: envelopeIds,
                },
            },
            limit: limit,
            offset: offset,
            order: [[safeOrderBy, safeOrder]],
        });
        return data.map((e: any) => Mapper.toDomain(e));
    }
    async getOnlyById(id: string): Promise<Debt | null> {

        const data = await this.model.findOne({
            where: {
                id,
            },
            raw: true,
        });
        return Mapper.toDomain(data) ?? null;
    }
    
    async getById(id: string, userId: string): Promise<Debt | null> {

        const envelopes = await this.models.Envelopes.findAll({
            where: { user_id: userId, name: 'debts' },
            attributes: ['id'],
            raw: true,
        });
        const envelopeIds = envelopes.map((env: any) => env.id);
        const data = await this.model.findOne({
            where: {
                id,
                envelope_id: {
                    [Op.in]: envelopeIds,
                },
            },
        });
        return Mapper.toDomain(data) ?? null;
    }

    async create(data: Debt): Promise<void> {
        const rawData = await Mapper.toPersistence(data);
        await this.model.create(rawData);
    }
    async delete(id: string): Promise<boolean> {
        const deletedCount = await this.model.destroy({
            where: { id },
        });

        return deletedCount > 0;
    }

    async deleteAll(ids: string[], userId: string): Promise<number> {
        const envelopes = await this.models.Envelopes.findAll({
            where: { user_id: userId },
            attributes: ['id'],
            raw: true,
        });
        const envelopeIds = envelopes.map((env: any) => env.id);
        return await this.model.destroy({
            where: {
                id: { [Op.in]: ids },
                envelope_id: { [Op.in]: envelopeIds },
            },
        });
    }

}