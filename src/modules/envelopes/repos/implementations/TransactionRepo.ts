import { Op, Sequelize } from "sequelize";
import { CreditCard } from "../../domain/creditCard";
import { Transaction } from "../../domain/transaction";
import { CreditCardMap } from "../../mappers/creditCardMap";
import { ITransactionRepo } from "../TransactionsRepo";
import { TransactionMap } from "../../mappers/transactionMap";

export class TransactionRepo implements ITransactionRepo {

    private models: any;

    constructor(models: any) {
        this.models = models;
    }

    async update(id: string, userId: string, transaction: Transaction): Promise<boolean> {
        const model = this.models.Transactions;
        const rawDebt = await TransactionMap.toPersistence(transaction);
        const [updatedRows] = await model.update(
            {...rawDebt,credit_card_id: rawDebt.credit_card_id === undefined ? null : rawDebt.credit_card_id},
            {
                where: {
                    id,
                    envelope_id: {
                      [Op.in]: Sequelize.literal(`(
                        SELECT id FROM "envelopes" WHERE user_id = '${userId}'
                      )`),
                    },
                  },
            },
        );
        if (updatedRows === 0) {
            return false;
        }
        return true;
    }
    async getAll(id: string): Promise<Transaction[]> {
        const model = this.models.Transactions;
        return await model.findAll({
            where: {
                envelope_id: {
                  [Op.in]: Sequelize.literal(`(
                    SELECT id FROM "envelopes" WHERE user_id = '${id}'
                  )`),
                },
              },
        });
    }

    async getById(id: string, userId: string): Promise<Transaction | null> {
        const model = this.models.Transactions;
        const debt = await model.findOne({
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

    async save(transaction: Transaction): Promise<void> {
        const model = this.models.Transactions;
        const rawDebt = await TransactionMap.toPersistence(transaction);
        await model.create(rawDebt);
    }

    async delete(id: string): Promise<void> {
        const model = this.models.Transactions;
        await model.destroy({
            where: {
                id,
            },
        });
    }

}