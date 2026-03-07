import { col, fn, literal, Op, Sequelize } from "sequelize";
import { ProcessedIncomesMap as Mapper } from "../../mappers";
import { Interface } from "../Interface";
import { ProcessedIncomes } from "../../domain/ProcessedIncomes";
import { YearMonths, Month, ToalByYearMonths } from "../../dtos";
import dayjs from "dayjs";

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
        const offset = page ? (page) * (pageSize || 10) : 0;

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

    async getAllByYearMonth(id: string, year: number, month: number, page?: number, pageSize?: number, orderBy?: string, order?: string): Promise<ProcessedIncomes[]> {
        const limit = pageSize || undefined;
        const offset = page ? (page) * (pageSize || 10) : 0;

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
                month,
                year
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




    async getProcessedMonth(userId: string): Promise<YearMonths> {
        const rows = await this.model.findAll({
            attributes: ['year', 'month'],
            where: { user_id: userId },
            raw: true,
        });
        const result: YearMonths = {};

        for (const row of rows) {
            const year = Number(row.year);
            const month = Number(row.month) as Month;

            if (!result[year]) {
                result[year] = [];
            }

            if (!result[year].includes(month)) {
                result[year].push(month);
            }
        }

        for (const year in result) {
            result[Number(year)] = result[Number(year)].sort((a, b) => a - b);
        }

        return result;
    }



    async create(processedIncome: ProcessedIncomes): Promise<void> {
        const rawData = await Mapper.toPersistence(processedIncome);
        await this.model.create(rawData);
    }

    async delete(id: string): Promise<boolean> {
        const deletedCount = await this.model.destroy({
            where: { id },
        });

        return deletedCount > 0;
    }

    async deleteAll(ids: string[], userId: string): Promise<number> {
        return await this.model.destroy({
            where: { id: { [Op.in]: ids }, user_id: userId },
        });
    }

    async getTotalbyMonth(year: number, month: number, userId: string): Promise<ToalByYearMonths> {
        const { fn, col, literal, where } = this.model.sequelize;

        const startDate = dayjs(`${year}-${month}-01`).startOf("month").toDate();
        const endDate = dayjs(`${year}-${month}-01`).endOf("month").toDate();
        const result: ToalByYearMonths = {
            total: await this.model.sum('total_income_processed', {
                where: { user_id: userId, month: month, year: year }
            })
        }
        return result;

    }

}