import { DebtsStatus } from "../../entities/debt/DebtsStatus";


export interface DebtDTO {
    id: string;
    creditCardId?: string;
    envelopeId: string;
    description: string;
    amount: number;
    installments_total: number;
    installments_paid: number;
    dueDate: Date;
    status: DebtsStatus;
}