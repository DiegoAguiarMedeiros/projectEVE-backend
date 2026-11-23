
import { randomUUID } from "crypto";
import { col, fn, literal, Op } from "sequelize";
import { Envelopes } from "../../domain/Envelopes";
import { EnvelopesMap as Mapper } from "../../mappers";
import { Interface } from "../Interface";
import { AnalyticsCurrentEnvelopesDTO } from "../../../graph/dtos";

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
        const offset = page ? (page) * (pageSize || 10) : 0;

        const data = await this.model.findAll({
            where: {
                user_id: id,
            },
            limit: limit,
            offset: offset,
            order: ['order'],
            raw: true,

        });
        return Promise.all(data.map(async (item: any) => {
            const total = await this.models.FixedExpenses.sum('amount', {
                where: { envelope_id: item.id },
            });
            return Mapper.toDomain({
                ...item,
                minAmount: total,
            })
        }));
    }

    async getAllMonthly(id: string, year: number, month: number): Promise<Envelopes[]> {
        const data = await this.model.findAll({
            where: {
                user_id: id,
            },
            order: ['order'],
            include: [
                {
                    model: this.models.EnvelopesAmounts,
                    as: 'EnvelopesAmounts',
                    required: true,
                    attributes: ['amount'],
                    where: {
                        month, year
                    },
                }
            ]
        });
        return data.map((item: any) => Mapper.toDomain(item));
    }

    async getUsedByEnvelopeID(id: string, year: number, month: number): Promise<number> {
        const data = await this.model.findAll({
            attributes: [
                'name',
                'color',
                [col('EnvelopesAmounts.amount'), 'envelope_amount'],
                [literal(`SUM(CASE WHEN "Transactions"."type" = 'Credit' THEN "Transactions"."amount" WHEN "Transactions"."payment_method" = 'envelope.transaction.payment_method.Reallocation' AND "Transactions"."type" = 'Debit' THEN -"Transactions"."amount" ELSE 0 END)`), 'effective_budget'],
                [literal(`SUM(CASE WHEN "Transactions"."payment_method" != 'envelope.transaction.payment_method.Reallocation' AND "Transactions"."type" = 'Debit' THEN "Transactions"."amount" ELSE 0 END)`), 'total_debit_no_realloc'],
            ],
            where: {
                id,
            },
            include: [
                {
                    model: this.models.EnvelopesAmounts,
                    as: 'EnvelopesAmounts',
                    required: false,
                    attributes: [],
                    where: {
                        month,
                        year,
                    },
                },
                {
                    model: this.models.Transactions,
                    as: 'Transactions',
                    required: false,
                    attributes: [],
                    where: {
                        status: 'transaction.status.completed',
                        reference_year: year,
                        reference_month: month,
                    },
                }
            ],
            group: ['Envelopes.id', 'EnvelopesAmounts.amount'],
            order: ['order'],
            raw: true,
        });
        const effectiveBudget = parseFloat(data[0]?.effective_budget ?? '0');
        const spent = parseFloat(data[0]?.total_debit_no_realloc ?? '0');
        const rawUsedPercent = effectiveBudget > 0
            ? (spent / effectiveBudget) * 100
            : (spent > 0 ? 100 : 0);
        const usedPercent = Math.min(100, Math.max(0, rawUsedPercent));
        return Number(usedPercent.toFixed(2));
    }
    async getAnalyticsCurrentEnvelopes(id: string, year: number, month: number): Promise<AnalyticsCurrentEnvelopesDTO> {
        const data = await this.model.findAll({
            attributes: [
                'name',
                'color',
                [col('EnvelopesAmounts.amount'), 'envelope_amount'],
                [literal(`SUM(CASE WHEN "Transactions"."type" = 'Credit' THEN "Transactions"."amount" WHEN "Transactions"."payment_method" = 'envelope.transaction.payment_method.Reallocation' AND "Transactions"."type" = 'Debit' THEN -"Transactions"."amount" ELSE 0 END)`), 'effective_budget'],
                [literal(`SUM(CASE WHEN "Transactions"."payment_method" != 'envelope.transaction.payment_method.Reallocation' AND "Transactions"."type" = 'Debit' THEN "Transactions"."amount" ELSE 0 END)`), 'total_debit_no_realloc'],
            ],
            where: {
                user_id: id,
            },
            include: [
                {
                    model: this.models.EnvelopesAmounts,
                    as: 'EnvelopesAmounts',
                    required: false,
                    attributes: [],
                    where: {
                        month,
                        year,
                    },
                },
                {
                    model: this.models.Transactions,
                    as: 'Transactions',
                    required: false,
                    attributes: [],
                    where: {
                        status: 'transaction.status.completed',
                        reference_year: year,
                        reference_month: month,
                    },
                }
            ],
            group: ['Envelopes.id', 'EnvelopesAmounts.amount'],
            order: ['order'],
            raw: true,
        });
        return Mapper.toAnalyticsCurrentEnvelopesDTO(data);
    }


    async getOnlyById(id: string): Promise<Envelopes | null> {
        const data = await this.model.findOne({
            where: {
                id
            },
            raw: true,
        });
        if (!data) return null;
        return Mapper.toDomain(data);
    }
    async getById(id: string, userId: string): Promise<Envelopes | null> {
        const data = await this.model.findOne({
            where: {
                id,
                user_id: userId,
            },
            raw: true,
        });
        if (!data) return null;
        return Mapper.toDomain(data);
    }

    async getByName(name: string, userId: string): Promise<Envelopes | null> {
        const data = await this.model.findOne({
            where: {
                name,
                user_id: userId,
            },
            raw: true,
        });
        if (!data) return null;
        return Mapper.toDomain(data);
    }

    async create(data: Envelopes): Promise<void> {
        const rawData = await Mapper.toPersistence(data);
        await this.model.create(rawData);
    }


    async createAmount(envelopeId: string, amount: number, year: number, month: number): Promise<void> {
        await this.adjustAmount(envelopeId, amount, year, month);
    }

    async adjustAmount(envelopeId: string, delta: number, year: number, month: number): Promise<void> {
        const roundedDelta = Math.round(Number(delta) * 100) / 100;
        await this.models.EnvelopesAmounts.sequelize.query(
            `INSERT INTO envelopes_amounts (id, envelope_id, amount, year, month, created_at, updated_at)
             VALUES (:id, :envelopeId, :delta, :year, :month, NOW(), NOW())
             ON CONFLICT (envelope_id, year, month)
             DO UPDATE SET
               amount = ROUND((envelopes_amounts.amount + EXCLUDED.amount)::numeric, 2),
               updated_at = NOW()`,
            {
                replacements: {
                    id: randomUUID(),
                    envelopeId,
                    delta: roundedDelta,
                    year,
                    month,
                },
            }
        );
    }

    async addAmount(envelopeId: string, amount: number, year: number, month: number): Promise<void> {
        await this.models.EnvelopesAmounts.update(
            { amount },
            {
                where: {
                    envelope_id: envelopeId,
                    year,
                    month
                },
            },
        );
    }
    async getAmount(envelopeId: string, year: number, month: number): Promise<number | null> {
        const data = await this.models.EnvelopesAmounts.findOne({
            where: {
                envelope_id: envelopeId,
                year,
                month
            },
            attributes: ['amount'],
            raw: true,
        });
        return data ? Number(data.amount) : null;
    }

    async delete(id: string): Promise<boolean> {
        const deletedCount = await this.model.destroy({
            where: { id },
        });

        return deletedCount > 0;
    }

    async getTotalPercentage(userId: string, excludeId?: string): Promise<number> {
        const where: any = { user_id: userId };
        if (excludeId) {
            where.id = { [Op.ne]: excludeId };
        }
        const result = await this.model.sum('percentage', { where });
        return result || 0;
    }

}