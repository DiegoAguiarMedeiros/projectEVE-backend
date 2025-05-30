import { Op, Sequelize } from "sequelize";
import { Interface } from "../Interface";
import { TransactionMap as Mapper } from "../../mappers";
import { Transaction, TransactionStatus } from "../../domain";

export class Repository implements Interface {

    private models: any;
    private model: any;

    constructor(models: any) {
        this.models = models;
        this.model = this.models.Transaction;
    }
    async updateStatus(id: string, status: TransactionStatus): Promise<boolean> {
        const [updatedRows] = await this.model.update(
            { status },
            {
                where: {
                    id,
                },
            },
        );
        return updatedRows > 0;
    }


    async update(id: string, data: Transaction): Promise<boolean> {

        const rawData = await Mapper.toPersistence(data);
        const [updatedRows] = await this.model.update(
            { ...rawData, credit_card_id: rawData.credit_card_id === undefined ? null : rawData.credit_card_id },
            {
                where: {
                    id,
                },
            },
        );
        if (updatedRows === 0) {
            return false;
        }
        return true;
    }
     


    async getAll(id: string, page?: number, pageSize?: number, orderBy?: string, order?: string): Promise<Transaction[]> {

        const limit = pageSize || undefined;
        const offset = page ? (page - 1) * (pageSize || 10) : 0;
        const allowedColumns = ["description", "amount", "date", "payment_method", "type", "status", "created_at"];
        const allowedOrders = ["asc", "desc"];

        const safeOrderBy = allowedColumns.includes(orderBy || "") ? orderBy : "created_at";
        const safeOrder = allowedOrders.includes(order || "") ? order : "desc";

        const data = await this.model.findAll({
            where: {
                envelope_id: {
                    [Op.in]: Sequelize.literal(`(SELECT id FROM "envelope" WHERE user_id = '${id}')`),
                },
            },
            limit: limit,
            offset: offset,
            order: [[safeOrderBy, safeOrder]],
            include: [
                {
                    model: this.models.Envelope,
                    as: 'Envelope',
                },
            ],
        });
        return data.map((e: any) => Mapper.toDomain(e));
    }
    async getAllByEnvelope(id: string, envelope: string, page?: number, pageSize?: number, orderBy?: string, order?: string): Promise<Transaction[]> {

        const limit = pageSize || undefined;
        const offset = page ? (page - 1) * (pageSize || 10) : 0;
        const allowedColumns = ["description", "amount", "date", "payment_method", "type", "status", "created_at"];
        const allowedOrders = ["asc", "desc"];

        const safeOrderBy = allowedColumns.includes(orderBy || "") ? orderBy : "created_at";
        const safeOrder = allowedOrders.includes(order || "") ? order : "desc";
        const data = await this.model.findAll({
            limit,
            offset,
            order: [[safeOrderBy, safeOrder]],
            include: [
                {
                    model: this.models.Envelope,
                    as: 'Envelope',
                    where: {
                        id: envelope,
                        user_id: id,
                    },
                    required: true,
                },
            ],
        });

        return data.map((e: any) => Mapper.toDomain(e));
    }

    async getById(id: string, userId: string): Promise<Transaction | null> {
        const data = await this.model.findOne({
            where: {
                id,
            },
            include: [
                {
                    model: this.models.Envelope,
                    as: 'Envelope',
                    where: {
                        user_id: userId,
                    },
                    required: true, 
                },
            ],
        });
        return Mapper.toDomain(data) ?? null;
    }


    async create(transaction: Transaction): Promise<void> {

        const rawData = await Mapper.toPersistence(transaction);
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