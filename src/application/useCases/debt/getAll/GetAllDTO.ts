import { Debt } from "../../../../domain/entities/debt/Debt";

export interface GetAllDTO {
    debts: Debt[];
}