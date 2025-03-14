import { ICreditCardRepo } from "../CreditCardRepo";
import { CreditCard } from "../../domain/creditCard";
import { CreditCardMap } from "../../mappers/creditCardMap";

export class CreditCardRepo implements ICreditCardRepo {

    private models: any;

    constructor(models: any) {
        this.models = models;
    }
    async checkName(name: string, userId: string): Promise<boolean> {
        const creditCardModel = this.models.CreditCards;
        const creditCard = await creditCardModel.findOne({
            where: {
                name,
                user_id: userId,
            },
            raw: true,
        });
        return !!creditCard;
    }
    async update(id: string, userId: string, creditCard: CreditCard): Promise<boolean> {
        const creditCardModel = this.models.CreditCards;

        // Atualiza o nome onde o id e o userId correspondem
        const [updatedRows] = await creditCardModel.update(
            creditCard, // Campos a serem atualizados
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

    async getAll(id: string, page?: number, pageSize?: number): Promise<CreditCard[]> {
        const creditCardModel = this.models.CreditCards;
        const limit = pageSize || undefined;
        const offset = page ? (page - 1) * (pageSize || 10) : 0;
        const creditCards = await creditCardModel.findAll({
            where: {
                user_id: id,
            },
            limit: limit,
            offset: offset,
        });
        return creditCards.map((creditCard: any) => CreditCardMap.toDomain(creditCard));
    }


    async getById(id: string, userId: string): Promise<CreditCard | null> {
        const creditCardModel = this.models.CreditCards;
        const creditCard = await creditCardModel.findOne({
            where: {
                id,
                user_id: userId,
            },
            raw: true,
        });
        return creditCard ?? null;
    }

    async save(CreditCard: CreditCard): Promise<void> {
        const creditCardModel = this.models.CreditCards;
        const rawCreditCard = await CreditCardMap.toPersistence(CreditCard);
        await creditCardModel.create(rawCreditCard);
    }

    async delete(id: string): Promise<void> {
        const creditCardModel = this.models.CreditCards;
        await creditCardModel.destroy({
            where: {
                id,
            },
        });
    }

}