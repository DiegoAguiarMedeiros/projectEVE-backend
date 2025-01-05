import { CreditCard } from "../../domain/creditCard";
import { Income } from "../../domain/income";
import { CreditCardMap } from "../../mappers/creditCardMap";
import { IncomeMap } from "../../mappers/incomeMap";
import { IIncomesRepo } from "../IncomesRepo";

export class IncomesRepo implements IIncomesRepo {

    private models: any;

    constructor(models: any) {
        this.models = models;
    }

    async update(id: string, userId: string, income: Income): Promise<boolean> {
        const model = this.models.Incomes;
        const rawIncome = await IncomeMap.toPersistence(income);
        // Atualiza o nome onde o id e o userId correspondem
        const [updatedRows] = await model.update(
            rawIncome, // Campos a serem atualizados
            {
                where: {
                    id,
                    user_id: userId,
                },
            }
        );
        if (updatedRows === 0) {
            return false;
        }
        return true;
    }
    async getAll(id: string): Promise<Income[]> {
        const model = this.models.Incomes;
        return await model.findAll({
            where: {
                user_id: id,
            },
        });
    }

    async getById(id: string, userId: string): Promise<Income | null> {
        const model = this.models.Incomes;
        const income = await model.findOne({
            where: {
                id,
                user_id: userId,
            },
            raw: true,
        });
        return income ?? null;
    }

    async save(income: Income): Promise<void> {
        const model = this.models.Incomes;
        const rawIncome = await IncomeMap.toPersistence(income);
        await model.create(rawIncome);
    }

    async delete(id: string): Promise<void> {
        const model = this.models.Incomes;
        await model.destroy({
            where: {
                id,
            },
        });
    }

}