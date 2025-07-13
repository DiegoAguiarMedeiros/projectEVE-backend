import { Sequelize } from "sequelize";
import { ProcessedIncomesMap as Mapper } from "../../mappers";
import { Interface } from "../Interface";
import { ProcessedIncomes } from "../../domain/ProcessedIncomes";

export class Repository implements Interface {

    private models: any;
    private model: any;

    constructor(models: any) {
        this.models = models;
        this.model = this.models.ProcessedIncome;
    }


    async update(id: string, data: ProcessedIncomes): Promise<boolean> {
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

    async getAll(id: string, page?: number, pageSize?: number, orderBy?: string, order?: string): Promise<ProcessedIncomes[]> {
        const limit = pageSize || undefined;
        const offset = page ? (page - 1) * (pageSize || 10) : 0;

        const allowedColumns = ["description", "amount", "payment_day", "created_at"];
        const allowedOrders = ["asc", "desc"];

        const safeOrderBy = allowedColumns.includes(orderBy || "") ? orderBy : "created_at";
        const safeOrder = allowedOrders.includes(order || "") ? order : "desc";


        const numericColumns = ["amount", "payment_day"];
        const orderStatement = numericColumns.includes(safeOrderBy!)
            ? Sequelize.col(safeOrderBy!)
            : safeOrderBy;

        const data = await this.model.findAll({
            where: {
                user_id: id,
            },
            limit: limit,
            offset: offset,
            order: [[orderStatement, safeOrder]],
        });
        return data.map((e: any) => Mapper.toDomain(e));
    }

    async getById(id: string, userId: string): Promise<ProcessedIncomes | null> {
        const data = await this.model.findOne({
            where: {
                id,
                user_id: userId,
            },
            raw: true,
        });
        return Mapper.toDomain(data) ?? null;
    }

    async getOnlyById(id: string): Promise<ProcessedIncomes | null> {
        const data = await this.model.findOne({
            where: {
                id,
            },
            raw: true,
        });
        return Mapper.toDomain(data) ?? null;
    }

    async getTotalIncomeByUserId(userId: string): Promise<number> {
        return await this.model.sum('amount', {
            where: { user_id: userId }
        });
    }

    async create(processedIncome: ProcessedIncomes): Promise<void> {
        const rawData = await Mapper.toPersistence(processedIncome);
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