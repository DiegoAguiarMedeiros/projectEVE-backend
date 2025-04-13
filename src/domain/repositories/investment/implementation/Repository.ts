import { Op, Sequelize } from "sequelize";
import { Interface } from "../Interface";
import { InvestmentsMap as Mapper } from "../../../../shared/mappers/investment";
import { Investment } from "../../../entities/investment/Investment";

export class Repository implements Interface {

  private models: any;
  private model: any;

  constructor(models: any) {
      this.models = models;
      this.model = this.models.Investments;
  }

  async update(id: string, userId: string, data: Investment): Promise<boolean> {
    const rawData = await Mapper.toPersistence(data);
    const [updatedRows] = await this.models.update(
      rawData,
      {
        where: {
          id,
          envelope_id: {
            [Op.in]: Sequelize.literal(`(
                        SELECT id FROM "envelopes" WHERE user_id = '${userId}'
                      )`),
          },
        },
      }
    );
    if (updatedRows === 0) {
      return false;
    }
    return true;
  }
  async getAll(id: string, page?: number, pageSize?: number, orderBy?: string, order?: string): Promise<Investment[]> {

    const limit = pageSize || undefined;
    const offset = page ? (page - 1) * (pageSize || 10) : 0;
    const allowedColumns = ["name", "flag"];
    const allowedOrders = ["asc", "desc"];

    const safeOrderBy = allowedColumns.includes(orderBy || "") ? orderBy : "createdAt";
    const safeOrder = allowedOrders.includes(order || "") ? order : "desc";

    const data = await this.models.findAll({
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

  async getById(id: string, userId: string): Promise<Investment | null> {
    const data = await this.models.findOne({
      where: {
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

  async create(investment: Investment): Promise<void> {
    const rawData = await Mapper.toPersistence(investment);
    await this.models.create(rawData);
  }

  async delete(id: string): Promise<void> {
    await this.models.destroy({
      where: {
        id,
      },
    });
  }

}