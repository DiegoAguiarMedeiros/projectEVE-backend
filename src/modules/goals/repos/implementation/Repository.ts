import { Op, Sequelize } from "sequelize";
import { Interface } from "../Interface";
import { GoalsMap as Mapper } from "../../mappers";
import { Goals } from "../../domain/Goals";

export class Repository implements Interface {

  private models: any;
  private model: any;

  constructor(models: any) {
    this.models = models;
    this.model = this.models.Goals;
  }

  async update(id: string, data: Goals): Promise<boolean> {
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
  async getAll(id: string, page?: number, pageSize?: number, orderBy?: string, order?: string): Promise<Goals[]> {

    const limit = pageSize || undefined;
    const offset = page ? (page ) * (pageSize || 10) : 0;
    const allowedColumns = ["name", "flag"];
    const allowedOrders = ["asc", "desc"];

    const safeOrderBy = allowedColumns.includes(orderBy || "") ? orderBy : "created_at";
    const safeOrder = allowedOrders.includes(order || "") ? order : "desc";
    const envelopes = await this.models.Envelopes.findAll({
      where: { user_id: id },
      attributes: ['id'],
      raw: true,
    });
    const envelopeIds = envelopes.map((env: any) => env.id);
    const data = await this.model.findAll({
      where: {
        envelope_id: {
          [Op.in]: envelopeIds,
        },
      },
      limit: limit,
      offset: offset,
      order: [[safeOrderBy, safeOrder]],
    });
    return data.map((e: any) => Mapper.toDomain(e));
  }

  async getById(id: string, userId: string): Promise<Goals | null> {

    const envelopes = await this.models.Envelopes.findAll({
      where: { user_id: userId, name: 'goals' },
      attributes: ['id'],
      raw: true,
    });
    const envelopeIds = envelopes.map((env: any) => env.id);
    const data = await this.model.findOne({
      where: {
        id,
        envelope_id: {
          [Op.in]: envelopeIds,
        },
      },
    });
    return Mapper.toDomain(data) ?? null;
  }

  async create(investment: Goals): Promise<void> {
    const rawData = await Mapper.toPersistence(investment);
    await this.model.create(rawData);
  }

  async delete(id: string): Promise<boolean> {
    const deletedCount = await this.model.destroy({
      where: { id },
    });

    return deletedCount > 0;
  }

  async deleteAll(ids: string[], userId: string): Promise<number> {
    const envelopes = await this.models.Envelopes.findAll({
      where: { user_id: userId },
      attributes: ['id'],
      raw: true,
    });
    const envelopeIds = envelopes.map((env: any) => env.id);
    return await this.model.destroy({
      where: {
        id: { [Op.in]: ids },
        envelope_id: { [Op.in]: envelopeIds },
      },
    });
  }

}