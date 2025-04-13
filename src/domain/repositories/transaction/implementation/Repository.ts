import { Op, Sequelize } from "sequelize";
import { Interface } from "../Interface";
import { TransactionMap as Mapper } from "../../../../shared/mappers/transaction";
import { Transaction } from "../../../entities/transaction/Transaction";

export class  Repository implements Interface {

    private models: any;
    private model: any;

    constructor(models: any) {
        this.models = models;
        this.model = this.models.Transactions;
    }

    async update(id: string, userId: string, data: Transaction): Promise<boolean> {

        const rawData = await Mapper.toPersistence(data);
        const [updatedRows] = await this.model.update(
            { ...rawData, credit_card_id: rawData.credit_card_id === undefined ? null : rawData.credit_card_id },
            {
                where: {
                    id,
                    envelope_id: {
                        [Op.in]: Sequelize.literal(`(
                        SELECT id FROM "envelopes" WHERE user_id = '${userId}'
                      )`),
                    },
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
        const allowedColumns = ["description", "amount", "date", "payment_method", "type", "status", "createdAt"];
        const allowedOrders = ["asc", "desc"];

        const safeOrderBy = allowedColumns.includes(orderBy || "") ? orderBy : "createdAt";
        const safeOrder = allowedOrders.includes(order || "") ? order : "desc";

        const data = await this.model.findAll({
            where: {
                envelope_id: {
                    [Op.in]: Sequelize.literal(`(SELECT id FROM "envelopes" WHERE user_id = '${id}')`),
                },
            },
            limit: limit,
            offset: offset,
            order: [[safeOrderBy, safeOrder]],
        });
        return data.map((e: any) => Mapper.toDomain(e));
    }

    async getById(id: string, userId: string): Promise<Transaction | null> {

        const data = await this.model.findOne({
            where: {
                id,
                envelope_id: {
                    [Op.in]: Sequelize.literal(`(
                      SELECT id FROM "envelopes" WHERE user_id = '${userId}'
                    )`),
                },
            },
            raw: true,
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