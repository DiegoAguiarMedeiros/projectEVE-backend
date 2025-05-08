import { Sequelize } from "sequelize";
import { Income } from "../../../entities/income/Income";
import { IncomeMap as Mapper } from "../../../../shared/mappers/income";
import { Interface } from "../Interface";

export class Repository implements Interface {

    private models: any;
    private model: any;

    constructor(models: any) {
        this.models = models;
        this.model = this.models.Income;
    }

    async update(id: string, data: Income): Promise<boolean> {
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

    async getAll(id: string, page?: number, pageSize?: number, orderBy?: string, order?: string): Promise<Income[]> {
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

    async getById(id: string, userId: string): Promise<Income | null> {
        const data = await this.model.findOne({
            where: {
                id,
                user_id: userId,
            },
            raw: true,
        });
        return Mapper.toDomain(data) ?? null;
    }

    async create(income: Income): Promise<void> {
        const rawData = await Mapper.toPersistence(income);
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