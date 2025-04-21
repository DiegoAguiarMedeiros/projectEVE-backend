import { DebtsStatus } from "../../entities/debt/DebtsStatus";


export interface DebtDTO {
    id: string;
    creditCardId?: string;
    envelopeId: string;
    description: string;
    amount: number;
    installmentsTotal: number;
    installmentsPaid: number;
    paymentDay: number;
    status: DebtsStatus;
}