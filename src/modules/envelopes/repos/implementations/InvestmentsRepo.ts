import { Op, Sequelize } from "sequelize";
import { CreditCard } from "../../domain/creditCard";
import { Debt } from "../../domain/debt";
import { Investments } from "../../domain/investments";
import { CreditCardMap } from "../../mappers/creditCardMap";
import { InvestmentsMap } from "../../mappers/investmentMap";
import { IInvestmentsRepo } from "../InvestmentsRepo";

export class InvestmentsRepo implements IInvestmentsRepo {

  private models: any;

  constructor(models: any) {
    this.models = models;
  }

  async update(id: string, userId: string, investment: Investments): Promise<boolean> {
    const model = this.models.Investments;
    const rawDebt = await InvestmentsMap.toPersistence(investment);
    // Atualiza o nome onde o id e o userId correspondem
    const [updatedRows] = await model.update(
      rawDebt, // Campos a serem atualizados
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
  async getAll(id: string, page?: number, pageSize?: number, orderBy?: string, order?: string): Promise<Investments[]> {
    const model = this.models.Investments;

    const limit = pageSize || undefined;
    const offset = page ? (page - 1) * (pageSize || 10) : 0;
    const allowedColumns = ["name", "flag"];
    const allowedOrders = ["asc", "desc"];

    const safeOrderBy = allowedColumns.includes(orderBy || "") ? orderBy : "createdAt";
    const safeOrder = allowedOrders.includes(order || "") ? order : "desc";

    const investments = await model.findAll({
      where: {
        envelope_id: {
          [Op.in]: Sequelize.literal(`(SELECT id FROM "envelopes" WHERE user_id = '${id}')`),
        },
      },
      limit: limit,
      offset: offset,
      order: [[safeOrderBy, safeOrder]],
    });
    return investments.map((investment: any) => InvestmentsMap.toDomain(investment));
  }

  async getById(id: string, userId: string): Promise<Debt | null> {
    const model = this.models.Investments;
    const debt = await model.findOne({
      where: {
        envelope_id: {
          [Op.in]: Sequelize.literal(`(
                    SELECT id FROM "envelopes" WHERE user_id = '${userId}'
                  )`),
        },
      },
      raw: true,
    });
    return debt ?? null;
  }

  async save(investment: Investments): Promise<void> {
    const model = this.models.Investments;
    const rawDebt = await InvestmentsMap.toPersistence(investment);
    await model.create(rawDebt);
  }

  async delete(id: string): Promise<void> {
    const model = this.models.Investments;
    await model.destroy({
      where: {
        id,
      },
    });
  }

}