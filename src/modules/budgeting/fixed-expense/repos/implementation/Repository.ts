import { Op, Sequelize } from "sequelize";
import { Interface } from "../Interface";
import { FixedExpenseMap as Mapper } from "../../mappers";
import { FixedExpense } from "../../domain/FixedExpense";

export class Repository implements Interface {

  private models: any;
  private model: any;

  constructor(models: any) {
      this.models = models;
      this.model = this.models.FixedExpense;
  }

  async update(id: string, data: FixedExpense): Promise<boolean> {
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
  async getAll(id: string, page?: number, pageSize?: number, orderBy?: string, order?: string): Promise<FixedExpense[]> {

    const limit = pageSize || undefined;
    const offset = page ? (page - 1) * (pageSize || 10) : 0;
    const allowedColumns = ["name", "flag"];
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

  async getById(id: string, userId: string): Promise<FixedExpense | null> {
    const data = await this.model.findOne({
      where: {
        envelope_id: {
          [Op.in]: Sequelize.literal(`(
                    SELECT id FROM "envelope" WHERE user_id = '${userId}'
                  )`),
        },
      },
      include: [
        {
          model: this.models.Envelope, 
          as: 'Envelope', 
        },
      ],
    });
    return Mapper.toDomain(data) ?? null;
  }

  async create(investment: FixedExpense): Promise<void> {
    const rawData = await Mapper.toPersistence(investment);
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