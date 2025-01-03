import { DebtsStatus } from "../domain/debtsStatus";

export interface DebtDTO {
    id: string;
    userId: string;
    creditCardId?: string;
    envelopeId: string;
    description: string;
    amount: number;
    installments_total: number;
    installments_paid: number;
    dueDate: Date;
    status: DebtsStatus;
}