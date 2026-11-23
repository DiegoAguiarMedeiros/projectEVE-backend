import { Op, Sequelize } from "sequelize";
import { Interface } from "../Interface";
import { FixedExpenseMap as Mapper } from "../../mappers";
import { FixedExpense } from "../../domain/FixedExpense";

export class Repository implements Interface {

  private models: any;
  private model: any;

  constructor(models: any) {
    this.models = models;
    this.model = this.models.FixedExpenses;
  }

  async update(id: string, data: FixedExpense): Promise<boolean> {
    const rawData = await Mapper.toPersistence(data);
    const [updatedRows] = await this.model.update(
      { ...rawData, credit_card_id: rawData.credit_card_id === undefined ? null : rawData.credit_card_id },
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
    const offset = page ? (page ) * (pageSize || 10) : 0;
    const allowedColumns = ["description", "amount", "payment_day", "created_at"];
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
      include: [
        {
          model: this.models.CreditCards,
          as: 'CreditCard',
          attributes: ['name'],
          required: false,
        },
      ],
      limit: limit,
      offset: offset,
      order: [[safeOrderBy, safeOrder]],
    });
    return data.map((e: any) => {
      const raw = e.get({ plain: true });
      return Mapper.toDomain({ ...raw, credit_card_name: raw.CreditCard?.name ?? null });
    });
  }

  async countAll(id: string): Promise<number> {
    const envelopes = await this.models.Envelopes.findAll({
      where: { user_id: id },
      attributes: ['id'],
      raw: true,
    });
    const envelopeIds = envelopes.map((env: any) => env.id);
    if (envelopeIds.length === 0) return 0;
    return await this.model.count({
      where: {
        envelope_id: {
          [Op.in]: envelopeIds,
        },
      },
    });
  }

  async getById(id: string, userId: string): Promise<FixedExpense | null> {

    const envelopes = await this.models.Envelopes.findAll({
      where: { user_id: userId },
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
      include: [
        {
          model: this.models.CreditCards,
          as: 'CreditCard',
          attributes: ['name'],
          required: false,
        },
      ],
    });
    if (!data) return null;
    const raw = data.get({ plain: true });
    return Mapper.toDomain({ ...raw, credit_card_name: raw.CreditCard?.name ?? null });
  }

  async create(investment: FixedExpense): Promise<void> {
    const rawData = await Mapper.toPersistence(investment);
    await this.model.create(rawData);
  }

  async delete(id: string): Promise<boolean> {
    const deletedCount = await this.model.destroy({
      where: { id },
    });

    return deletedCount > 0;
  }

  async getTotalByEnvelope(envelopeId: string): Promise<number> {
    const total = await this.model.sum('amount', {
      where: { envelope_id: envelopeId },
    });
    return total || 0;
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