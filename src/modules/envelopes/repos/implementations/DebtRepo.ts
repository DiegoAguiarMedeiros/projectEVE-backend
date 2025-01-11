import { Op, Sequelize } from "sequelize";
import { CreditCard } from "../../domain/creditCard";
import { Debt } from "../../domain/debt";
import { CreditCardMap } from "../../mappers/creditCardMap";
import { DebtMap } from "../../mappers/debtMap";
import { IDebtRepo } from "../DebtsRepo";

export class DebtRepo implements IDebtRepo {

    private models: any;

    constructor(models: any) {
        this.models = models;
    }

    async update(id: string, userId: string, debt: Debt): Promise<boolean> {
        const debtModel = this.models.Debts;
        const rawDebt = await DebtMap.toPersistence(debt);
        // Atualiza o nome onde o id e o userId correspondem
        const [updatedRows] = await debtModel.update(
            rawDebt, // Campos a serem atualizados
            {
                where: {
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
    async getAll(id: string): Promise<Debt[]> {
        const debtModel = this.models.Debts;
        return await debtModel.findAll({
            where: {
                envelope_id: {
                  [Op.in]: Sequelize.literal(`(
                    SELECT id FROM "envelopes" WHERE user_id = '${id}'
                  )`),
                },
              },
        });
    }

    async getById(id: string, userId: string): Promise<Debt | null> {
        const debtModel = this.models.Debts;
        const debt = await debtModel.findOne({
            where: {
                id,
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

    async save(debt: Debt): Promise<void> {
        const debtModel = this.models.Debts;
        const rawDebt = await DebtMap.toPersistence(debt);
        console.log("rawDebt", rawDebt)
        await debtModel.create(rawDebt);
    }

    async delete(id: string): Promise<void> {
        const debtModel = this.models.Debts;
        await debtModel.destroy({
            where: {
                id,
            },
        });
    }

}