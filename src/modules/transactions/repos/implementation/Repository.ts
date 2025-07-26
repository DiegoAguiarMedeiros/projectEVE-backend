import { Op, Sequelize } from "sequelize";
import { Interface } from "../Interface";
import { TransactionsMap as Mapper } from "../../mappers";
import { Transactions, TransactionsStatus } from "../../domain";
import dayjs from "dayjs"; // ou use Date diretamente se preferir não adicionar uma dependência
export class Repository implements Interface {

    private models: any;
    private model: any;

    constructor(models: any) {
        this.models = models;
        this.model = this.models.Transactions;
    }
    async updateStatus(id: string, status: TransactionsStatus): Promise<boolean> {
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


    async update(id: string, data: Transactions): Promise<boolean> {

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



    async getAll(id: string, page?: number, pageSize?: number, orderBy?: string, order?: string): Promise<Transactions[]> {

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

    async getAllByEnvelope(
        id: string,
        envelope: string,
        year: number,
        month: number,
        page?: number,
        pageSize?: number,
        orderBy?: string,
        order?: string
    ): Promise<Transactions[]> {
        const limit = pageSize || undefined;
        const offset = page ? (page - 1) * (pageSize || 10) : 0;
        const allowedColumns = ["description", "amount", "date", "payment_method", "type", "status", "created_at"];
        const allowedOrders = ["asc", "desc"];

        const safeOrderBy = allowedColumns.includes(orderBy || "") ? orderBy : "created_at";
        const safeOrder = allowedOrders.includes(order || "") ? order : "desc";

        // Cria início e fim do mês usando dayjs (ou new Date manualmente)
        const startDate = dayjs(`${year}-${month}-01`).startOf("month").toDate();
        const endDate = dayjs(`${year}-${month}-01`).endOf("month").toDate();

        console.log("Start Date:", startDate);
        console.log("End Date:", endDate);
        const data = await this.model.findAll({
            limit,
            offset,
            order: [[safeOrderBy, safeOrder]],
            where: {
                date: {
                    [Op.between]: [startDate, endDate],
                },
                type: 'Debit'
            },
            include: [
                {
                    model: this.models.Envelopes,
                    as: 'Envelope',
                    where: {
                        id: envelope,
                        user_id: id,
                    },
                    required: true,
                },
            ],
        });
        
        console.log("data:", data);
        return data.map((e: any) => Mapper.toDomain(e));
    }


    async getById(id: string, userId: string): Promise<Transactions | null> {
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


    async create(transaction: Transactions): Promise<void> {

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