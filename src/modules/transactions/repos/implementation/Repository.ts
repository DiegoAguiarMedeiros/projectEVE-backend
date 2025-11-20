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
        const offset = page ? (page) * (pageSize || 10) : 0;
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
        const offset = page ? (page) * (pageSize || 10) : 0;
        const allowedColumns = ["description", "amount", "date", "payment_method", "type", "status", "created_at"];
        const allowedOrders = ["asc", "desc"];

        const safeOrderBy = allowedColumns.includes(orderBy || "") ? orderBy : "created_at";
        const safeOrder = allowedOrders.includes(order || "") ? order : "desc";

        // Cria início e fim do mês usando dayjs (ou new Date manualmente)
        const startDate = dayjs(`${year}-${month}-01`).startOf("month").toDate();
        const endDate = dayjs(`${year}-${month}-01`).endOf("month").toDate();

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

        return data.map((e: any) => Mapper.toDomain(e));
    }
    async getAllByProcessedIncomesId(
        processedIncomesId: string,
    ): Promise<Transactions[]> {

        const data = await this.model.findAll({
            where: {
                    processed_incomes_id: processedIncomesId,
            }
        });

        return data.map((e: any) => Mapper.toDomain(e));
    }


    async getById(id: string, userId: string): Promise<Transactions | null> {
        const data = await this.model.findOne({
            where: {
                id,
            },
        });
        return Mapper.toDomain(data) ?? null;
    }


    async getIncomesMonthOverview(year: number, month: number, userId: string): Promise<number> {
        const startDate = dayjs(`${year}-${month}-01`).startOf("month").toDate();
        const endDate = dayjs(`${year}-${month}-01`).endOf("month").toDate();

        return await this.model.sum('amount', {
            include: [
                {
                    model: this.models.Envelopes,
                    attributes: [],
                    as: "Envelope",
                    where: {
                        user_id: userId,
                    }
                }
            ],
            where: {
                type: "Credit",
                date: {
                    [Op.between]: [startDate, endDate],
                },
            },
        });
    }


    async getGoalsMonthOverview(year: number, month: number, userId: string): Promise<number> {
        const { fn, col, literal, where } = this.model.sequelize;

        const startDate = dayjs(`${year}-${month}-01`).startOf("month").toDate();
        const endDate = dayjs(`${year}-${month}-01`).endOf("month").toDate();

        return await this.model.sum('amount', {
            include: [
                {
                    model: this.models.Envelopes,
                    attributes: [],
                    as: "Envelope",
                    where: {
                        user_id: userId,
                        name: "goals"
                    }
                }
            ],
            where: {
                type: "Credit",
                date: {
                    [Op.between]: [startDate, endDate],
                },
            },
        });

    }
    async getExpensesMonthOverview(year: number, month: number, userId: string): Promise<number> {
        const { fn, col, literal, where } = this.model.sequelize;

        const startDate = dayjs(`${year}-${month}-01`).startOf("month").toDate();
        const endDate = dayjs(`${year}-${month}-01`).endOf("month").toDate();

        return await this.model.sum('amount', {
            include: [
                {
                    model: this.models.Envelopes,
                    attributes: [],
                    as: "Envelope",
                    where: {
                        user_id: userId,
                    }
                }
            ],
            where: {
                type: "Debit",
                date: {
                    [Op.between]: [startDate, endDate],
                },
            },
        });
    }
    async getIncomesByYear(year: number, userId: string): Promise<number[]> {
        const { fn, col, literal, where } = this.model.sequelize;

        const data = await this.model.findAll({
            attributes: [
                [fn("EXTRACT", literal("MONTH FROM date")), "month"],
                [fn("SUM", col("amount")), "amount"]
            ],
            include: [
                {
                    model: this.models.Envelopes,
                    attributes: [],
                    as: "Envelope",
                    where: {
                        user_id: userId,
                    }
                }
            ],
            where: {
                type: "Credit",
                [Op.and]: where(fn("EXTRACT", literal("YEAR FROM date")), year)
            },
            group: [literal("EXTRACT(MONTH FROM date)")],
            raw: true,
            order: [literal("EXTRACT(MONTH FROM date) ASC")]
        });
        return Mapper.toAnalyticsEnvelopesByYear(data);
    }


    async getGoalsByYear(year: number, userId: string): Promise<number[]> {
        const { fn, col, literal, where } = this.model.sequelize;

        const data = await this.model.findAll({
            attributes: [
                [fn("EXTRACT", literal("MONTH FROM date")), "month"],
                [fn("SUM", col("amount")), "amount"]
            ],
            include: [
                {
                    model: this.models.Envelopes,
                    attributes: [],
                    as: "Envelope",
                    where: {
                        user_id: userId,
                        name: "goals"
                    }
                }
            ],
            where: {
                type: "Credit",
                [Op.and]: where(fn("EXTRACT", literal("YEAR FROM date")), year)
            },
            group: [literal("EXTRACT(MONTH FROM date)")],
            raw: true,
            order: [literal("EXTRACT(MONTH FROM date) ASC")]
        });

        return Mapper.toAnalyticsEnvelopesByYear(data);
    }
    async getExpensesByYear(year: number, userId: string): Promise<number[]> {
        const { fn, col, literal, where } = this.model.sequelize;

        const data = await this.model.findAll({
            attributes: [
                [fn("EXTRACT", literal("MONTH FROM date")), "month"],
                [fn("SUM", col("amount")), "amount"]
            ],
            include: [
                {
                    model: this.models.Envelopes,
                    attributes: [],
                    as: "Envelope",
                    where: {
                        user_id: userId,
                    }
                }
            ],
            where: {
                type: "Debit",
                [Op.and]: where(fn("EXTRACT", literal("YEAR FROM date")), year)
            },
            group: [literal("EXTRACT(MONTH FROM date)")],
            raw: true,
            order: [literal("EXTRACT(MONTH FROM date) ASC")]
        });
        return Mapper.toAnalyticsEnvelopesByYear(data);
    }



    async create(transaction: Transactions): Promise<void> {

        const rawData = await Mapper.toPersistence(transaction);
        await this.model.create(rawData);
    }

    async delete(id: string): Promise<boolean> {
        const deletedCount = await this.model.destroy({
            where: { id },
        });

        return deletedCount > 0;
    }

}