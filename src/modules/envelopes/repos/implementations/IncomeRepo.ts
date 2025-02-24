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
    async getAll(id: string, page?: number, pageSize?: number): Promise<Income[]> {
        const model = this.models.Incomes;
    
        // Se pageSize não for fornecido, traz todos os registros (sem limite)
        const limit = pageSize || undefined;  // undefined significa sem limite
    
        // Calcula o offset, apenas se page for fornecido
        const offset = page ? (page - 1) * (pageSize || 10) : 0;
    
        // Faz a consulta no banco com a possibilidade de paginar
        const incomes = await model.findAll({
            where: {
                user_id: id,
            },
            limit: limit,
            offset: offset,
        });
    
        // Mapeia os resultados para o domínio de Income e retorna os dados
        return incomes.map((income: any) => IncomeMap.toDomain(income));
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