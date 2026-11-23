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
            limit: limit,
            offset: offset,
            order: [[safeOrderBy, safeOrder]],
            include: [
                {
                    model: this.models.Envelopes,
                    as: 'Envelope',
                    where: {
                        user_id: id,
                    },
                    required: true,
                },
            ],
        });
        return data.map((e: any) => Mapper.toDomain(e));
    }

    async countAll(id: string): Promise<number> {
        return await this.model.count({
            include: [
                {
                    model: this.models.Envelopes,
                    as: 'Envelope',
                    where: {
                        user_id: id,
                    },
                    required: true,
                },
            ],
        });
    }

    async getAllByEnvelope(
        id: string,
        envelope: string,
        year: number,
        month: number,
        page?: number,
        pageSize?: number,
        orderBy?: string,
        order?: string,
        type?: string
    ): Promise<Transactions[]> {
        const limit = pageSize || undefined;
        const offset = page ? (page) * (pageSize || 10) : 0;
        const allowedColumns = ["description", "amount", "date", "payment_method", "type", "status", "created_at"];
        const allowedOrders = ["asc", "desc"];

        const safeOrderBy = allowedColumns.includes(orderBy || "") ? orderBy : "created_at";
        const safeOrder = allowedOrders.includes(order || "") ? order : "desc";

        // Build where clause for transactions
        // Show Debit transactions (all) + Credit transactions without processedIncomesId (manual)
        // Excludes salary credit transactions (Credit with processedIncomesId)
        // Excludes reallocation transactions
        const whereClause: any = {
            reference_year: year,
            reference_month: month,
            payment_method: {
                [Op.ne]: 'envelope.transaction.payment_method.Reallocation',
            },
            [Op.or]: [
                { type: 'Debit' },
                { processed_incomes_id: null },
            ],
        };

        // Add type filter if provided
        if (type && (type === "Debit" || type === "Credit")) {
            whereClause.type = type;
        }

        const data = await this.model.findAll({
            limit,
            offset,
            order: [[safeOrderBy, safeOrder]],
            where: whereClause,
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
                {
                    model: this.models.CreditCards,
                    as: 'CreditCard',
                    attributes: ['name'],
                    required: false,
                },
            ],
        });

        return data.map((e: any) => {
            const raw = e.get({ plain: true });
            return Mapper.toDomain({ ...raw, credit_card_name: raw.CreditCard?.name ?? null });
        });
    }

    async countAllByEnvelope(
        id: string,
        envelope: string,
        year: number,
        month: number,
        type?: string
    ): Promise<number> {
        const whereClause: any = {
            reference_year: year,
            reference_month: month,
            payment_method: {
                [Op.ne]: 'envelope.transaction.payment_method.Reallocation',
            },
            [Op.or]: [
                { type: 'Debit' },
                { processed_incomes_id: null },
            ],
        };

        if (type && (type === "Debit" || type === "Credit")) {
            whereClause.type = type;
        }

        return await this.model.count({
            where: whereClause,
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

    async deleteOrphanedByUserAndMonth(userId: string, year: number, month: number): Promise<void> {
        const envelopes = await this.models.Envelopes.findAll({
            attributes: ['id'],
            where: { user_id: userId },
        });
        const envelopeIds = envelopes.map((e: any) => e.id);

        if (envelopeIds.length === 0) return;

        // Delete transactions with stale processed_incomes_id references (the referenced record no longer exists)
        const validProcessedIncomes = await this.models.ProcessedIncome.findAll({
            attributes: ['id'],
            where: { user_id: userId },
        });
        const validIds = validProcessedIncomes.map((e: any) => e.id);

        await this.model.destroy({
            where: {
                processed_incomes_id: validIds.length > 0
                    ? { [Op.not]: null, [Op.notIn]: validIds }
                    : { [Op.not]: null },
                envelope_id: { [Op.in]: envelopeIds },
                reference_year: year,
                reference_month: month,
            },
        });
    }

    async getAllByDebtId(debtId: string): Promise<Transactions[]> {
        const data = await this.model.findAll({
            where: {
                debt_id: debtId,
            }
        });

        return data.map((e: any) => Mapper.toDomain(e));
    }


    async getById(id: string, userId: string): Promise<Transactions | null> {
        const queryOptions: any = {
            where: {
                id,
            },
        };
        if (userId) {
            queryOptions.include = [
                {
                    model: this.models.Envelopes,
                    as: 'Envelope',
                    where: {
                        user_id: userId,
                    },
                    required: true,
                },
            ];
        }
        const data = await this.model.findOne(queryOptions);
        if (!data) return null;
        return Mapper.toDomain(data);
    }


    async getIncomesMonthOverview(year: number, month: number, userId: string): Promise<number> {
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
                status: "transaction.status.completed",
                payment_method: { [Op.ne]: 'envelope.transaction.payment_method.Reallocation' },
                reference_year: year,
                reference_month: month,
            },
        });
    }


    async getGoalsMonthOverview(year: number, month: number, userId: string): Promise<number> {
        const goalsInclude = [
            {
                model: this.models.Envelopes,
                attributes: [],
                as: "Envelope",
                where: { user_id: userId, name: "goals" }
            }
        ];

        const creditSum = await this.model.sum('amount', {
            include: goalsInclude,
            where: {
                type: "Credit",
                status: "transaction.status.completed",
                payment_method: { [Op.ne]: 'envelope.transaction.payment_method.Reallocation' },
                reference_year: year,
                reference_month: month,
            },
        });

        const debitReallocSum = await this.model.sum('amount', {
            include: goalsInclude,
            where: {
                type: "Debit",
                status: "transaction.status.completed",
                payment_method: 'envelope.transaction.payment_method.Reallocation',
                reference_year: year,
                reference_month: month,
            },
        });

        return (creditSum || 0) - (debitReallocSum || 0);
    }
    async getGoalsCumulativeAmount(year: number, month: number, userId: string): Promise<number> {
        const goalsInclude = [
            {
                model: this.models.Envelopes,
                attributes: [],
                as: "Envelope",
                where: { user_id: userId, name: "goals" }
            }
        ];
        const cumulativeWhere = {
            [Op.or]: [
                { reference_year: { [Op.lt]: year } },
                { reference_year: year, reference_month: { [Op.lte]: month } },
            ],
        };

        const creditSum = await this.model.sum('amount', {
            include: goalsInclude,
            where: {
                type: "Credit",
                status: "transaction.status.completed",
                payment_method: { [Op.ne]: 'envelope.transaction.payment_method.Reallocation' },
                ...cumulativeWhere,
            },
        });

        const debitReallocSum = await this.model.sum('amount', {
            include: goalsInclude,
            where: {
                type: "Debit",
                status: "transaction.status.completed",
                payment_method: 'envelope.transaction.payment_method.Reallocation',
                ...cumulativeWhere,
            },
        });

        return (creditSum || 0) - (debitReallocSum || 0);
    }

    async getExpensesMonthOverview(year: number, month: number, userId: string): Promise<number> {
        return await this.model.sum('amount', {
            include: [
                {
                    model: this.models.Envelopes,
                    attributes: [],
                    as: "Envelope",
                    where: {
                        user_id: userId,
                        name: { [Op.ne]: "goals" },
                    }
                }
            ],
            where: {
                type: "Debit",
                status: "transaction.status.completed",
                payment_method: { [Op.ne]: 'envelope.transaction.payment_method.Reallocation' },
                reference_year: year,
                reference_month: month,
            },
        });
    }
    async getIncomesByYear(year: number, userId: string): Promise<number[]> {
        const { fn, col } = this.model.sequelize;

        const data = await this.model.findAll({
            attributes: [
                [col("reference_month"), "month"],
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
                status: "transaction.status.completed",
                payment_method: { [Op.ne]: 'envelope.transaction.payment_method.Reallocation' },
                reference_year: year
            },
            group: [col("reference_month")],
            raw: true,
            order: [[col("reference_month"), "ASC"]]
        });
        return Mapper.toAnalyticsEnvelopesByYear(data);
    }


    async getGoalsByYear(year: number, userId: string): Promise<number[]> {
        const { col, literal } = this.model.sequelize;

        const data = await this.model.findAll({
            attributes: [
                [col("reference_month"), "month"],
                [literal(`SUM(CASE WHEN "Transactions"."type" = 'Credit' AND "Transactions"."payment_method" != 'envelope.transaction.payment_method.Reallocation' THEN "Transactions"."amount" WHEN "Transactions"."type" = 'Debit' AND "Transactions"."payment_method" = 'envelope.transaction.payment_method.Reallocation' THEN -"Transactions"."amount" ELSE 0 END)`), "amount"]
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
                status: "transaction.status.completed",
                reference_year: year
            },
            group: [col("reference_month")],
            raw: true,
            order: [[col("reference_month"), "ASC"]]
        });

        return Mapper.toAnalyticsEnvelopesByYear(data);
    }
    async getExpensesByYear(year: number, userId: string): Promise<number[]> {
        const { fn, col } = this.model.sequelize;

        const data = await this.model.findAll({
            attributes: [
                [col("reference_month"), "month"],
                [fn("SUM", col("amount")), "amount"]
            ],
            include: [
                {
                    model: this.models.Envelopes,
                    attributes: [],
                    as: "Envelope",
                    where: {
                        user_id: userId,
                        name: { [Op.ne]: "goals" },
                    }
                }
            ],
            where: {
                type: "Debit",
                status: "transaction.status.completed",
                payment_method: { [Op.ne]: 'envelope.transaction.payment_method.Reallocation' },
                reference_year: year
            },
            group: [col("reference_month")],
            raw: true,
            order: [[col("reference_month"), "ASC"]]
        });
        return Mapper.toAnalyticsEnvelopesByYear(data);
    }



    async getUpcomingPendingTransaction(id: string, page?: number, pageSize?: number, orderBy?: string, order?: string, year?: number, month?: number): Promise<Transactions[]> {

        const limit = pageSize || undefined;
        const offset = page ? (page) * (pageSize || 10) : 0;
        const allowedColumns = ["description", "amount", "date", "payment_method", "type", "status", "created_at"];
        const allowedOrders = ["asc", "desc"];

        const safeOrderBy = allowedColumns.includes(orderBy || "") ? orderBy : "date";
        const safeOrder = allowedOrders.includes(order || "") ? order : "asc";

        const today = dayjs().startOf("day").toDate();
        const in7Days = dayjs().add(15, "day").endOf("day").toDate();

        const dateFilter = (year && month)
            ? { reference_year: year, reference_month: month }
            : { [Op.or]: [{ date: { [Op.lte]: today } }, { date: { [Op.between]: [today, in7Days] } }] };

        const data = await this.model.findAll({
            where: {
                status: {
                    [Op.in]: ["transaction.status.pending", "transaction.status.overdue"],
                },
                ...dateFilter,
            },
            limit: limit,
            offset: offset,
            order: [[safeOrderBy, safeOrder]],
            include: [
                {
                    model: this.models.Envelopes,
                    as: 'Envelope',
                    where: {
                        user_id: id,
                    },
                    required: true,
                },
                {
                    model: this.models.CreditCards,
                    as: 'CreditCard',
                    attributes: ['name'],
                    required: false,
                },
            ],
        });
        return data.map((e: any) => {
            const raw = e.get({ plain: true });
            return Mapper.toDomain({ ...raw, credit_card_name: raw.CreditCard?.name ?? null });
        });
    }

    async countUpcomingPendingTransaction(id: string, year?: number, month?: number): Promise<number> {
        const today = dayjs().startOf("day").toDate();
        const in7Days = dayjs().add(15, "day").endOf("day").toDate();

        const dateFilter = (year && month)
            ? { reference_year: year, reference_month: month }
            : { [Op.or]: [{ date: { [Op.lte]: today } }, { date: { [Op.between]: [today, in7Days] } }] };

        return await this.model.count({
            where: {
                status: {
                    [Op.in]: ["transaction.status.pending", "transaction.status.overdue"],
                },
                ...dateFilter,
            },
            include: [
                {
                    model: this.models.Envelopes,
                    as: 'Envelope',
                    where: {
                        user_id: id,
                    },
                    required: true,
                },
            ],
        });
    }

    async existsByDescriptionAndMonth(userId: string, description: string, year: number, month: number): Promise<boolean> {
        const count = await this.model.count({
            where: {
                description,
                type: "Debit",
                processed_incomes_id: { [Op.is]: null },
                reference_year: year,
                reference_month: month,
            },
            include: [
                {
                    model: this.models.Envelopes,
                    as: 'Envelope',
                    where: { user_id: userId },
                    required: true,
                },
            ],
        });

        return count > 0;
    }

    async getTotalPendingDebitsByEnvelope(envelopeId: string, year: number, month: number): Promise<number> {
        const result = await this.model.findOne({
            attributes: [
                [Sequelize.fn('COALESCE', Sequelize.fn('SUM', Sequelize.col('amount')), 0), 'total'],
            ],
            where: {
                envelope_id: envelopeId,
                type: 'Debit',
                status: 'transaction.status.pending',
                reference_year: year,
                reference_month: month,
            },
            raw: true,
        });
        return parseFloat(result?.total ?? '0');
    }

    async resetToUnprocessed(processedIncomesId: string): Promise<void> {
        await this.model.update(
            {
                status: 'transaction.status.pending',
                processed_incomes_id: null,
            },
            {
                where: { processed_incomes_id: processedIncomesId },
            },
        );
    }

    async getDebtTransactionsByMonth(userId: string, year: number, month: number): Promise<Transactions[]> {
        const envelopes = await this.models.Envelopes.findAll({
            attributes: ['id'],
            where: { user_id: userId },
        });
        const envelopeIds = envelopes.map((e: any) => e.id);

        if (envelopeIds.length === 0) return [];

        const data = await this.model.findAll({
            where: {
                debt_id: { [Op.not]: null },
                processed_incomes_id: { [Op.is]: null },
                envelope_id: { [Op.in]: envelopeIds },
                reference_year: year,
                reference_month: month,
            },
        });

        return data.map((e: any) => Mapper.toDomain(e));
    }

    async getOrphanedTransactionsByMonth(userId: string, year: number, month: number): Promise<Transactions[]> {
        const envelopes = await this.models.Envelopes.findAll({
            attributes: ['id'],
            where: { user_id: userId },
        });
        const envelopeIds = envelopes.map((e: any) => e.id);

        if (envelopeIds.length === 0) return [];

        const validProcessedIncomes = await this.models.ProcessedIncome.findAll({
            attributes: ['id'],
            where: { user_id: userId },
        });
        const validIds = validProcessedIncomes.map((e: any) => e.id);

        const data = await this.model.findAll({
            where: {
                processed_incomes_id: validIds.length > 0
                    ? { [Op.not]: null, [Op.notIn]: validIds }
                    : { [Op.not]: null },
                envelope_id: { [Op.in]: envelopeIds },
                reference_year: year,
                reference_month: month,
            },
        });

        return data.map((e: any) => Mapper.toDomain(e));
    }

    async resetDebtsByMonth(userId: string, year: number, month: number): Promise<void> {
        const envelopes = await this.models.Envelopes.findAll({
            attributes: ['id'],
            where: { user_id: userId },
        });
        const envelopeIds = envelopes.map((e: any) => e.id);

        if (envelopeIds.length === 0) return;

        await this.model.update(
            { status: 'transaction.status.pending' },
            {
                where: {
                    debt_id: { [Op.not]: null },
                    processed_incomes_id: { [Op.is]: null },
                    envelope_id: { [Op.in]: envelopeIds },
                    reference_year: year,
                    reference_month: month,
                },
            },
        );
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