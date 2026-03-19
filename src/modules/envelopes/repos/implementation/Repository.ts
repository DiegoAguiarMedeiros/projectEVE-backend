
import { col, fn, Op } from "sequelize";
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
                [fn('SUM', col('Transactions.amount')), 'total_amount'],
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
                        date: {
                            [Op.gte]: new Date(year, month - 1, 1),
                            [Op.lt]: new Date(year, month, 1),
                        },
                        type: 'Credit',
                    },
                }
            ],
            group: ['Envelopes.id', 'EnvelopesAmounts.amount'],
            order: ['order'],
            raw: true,
        });
        const val = parseFloat(data[0].total_amount ?? '0');
        const sub = parseFloat(data[0].envelope_amount ?? '0');
        const usedPercent = val > 0 ? ((val - sub) / val) * 100 : 0;
        return Number(usedPercent.toFixed(2));
    }
    async getAnalyticsCurrentEnvelopes(id: string, year: number, month: number): Promise<AnalyticsCurrentEnvelopesDTO> {
        const data = await this.model.findAll({
            attributes: [
                'name',
                'color',
                [col('EnvelopesAmounts.amount'), 'envelope_amount'],
                [fn('SUM', col('Transactions.amount')), 'total_amount'],
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
                        date: {
                            [Op.gte]: new Date(year, month - 1, 1),
                            [Op.lt]: new Date(year, month, 1),
                        },
                        type: 'Credit',
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
        return Mapper.toDomain(data) ?? null;
    }
    async getById(id: string, userId: string): Promise<Envelopes | null> {
        const data = await this.model.findOne({
            where: {
                id,
                user_id: userId,
            },
            raw: true,
        });
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


    async createAmount(envelopeId: string, amount: number, year: number, month: number): Promise<void> {
        await this.models.EnvelopesAmounts.create({
            envelope_id: envelopeId,
            amount,
            year,
            month,
        });
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

    async getTotalPercentage(userId: string, excludeId: string): Promise<number> {
        const result = await this.model.sum('percentage', {
            where: { user_id: userId, id: { [Op.ne]: excludeId } }
        });
        return result || 0;
    }

}