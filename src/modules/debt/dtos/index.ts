import { DebtsStatus } from "../domain";



export interface DebtDTO {
    id: string;
    envelopeId: string;
    description: string;
    amount: number;
    installmentsTotal: number;
    installmentsPaid: number;
    paymentDay: number;
    status: DebtsStatus;
}

export interface DebtWithoutIdAndEnvelopeIdDTO extends Omit<
    DebtDTO, 'id' | 'envelopeId'
> { }

export interface CreateDTO extends DebtWithoutIdAndEnvelopeIdDTO {
    userId: string;
}

export interface DebtIdDTO extends Omit<
    DebtDTO, 'envelopeId' | 'description' | 'amount' | 'installmentsTotal' | 'installmentsPaid' | 'paymentDay' | 'status'
> { }

export interface DeleteDTO extends DebtIdDTO { userId: string; }

export interface GetByIdDTO extends DebtIdDTO { userId: string; }

export interface UpdateDTO {
    request: GetByIdDTO;
    fieldUpdate: DebtWithoutIdAndEnvelopeIdDTO;
}