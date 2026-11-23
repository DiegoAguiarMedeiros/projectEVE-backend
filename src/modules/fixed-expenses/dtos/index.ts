import { PaymentMethod } from "../../transactions/domain/PaymentMethod";

export interface FixedExpenseDTO {
  id: string;
  envelopeId: string;
  description: string;
  amount: number;
  paymentDay: number;
  paymentMethod?: PaymentMethod;
  creditCardId?: string;
  creditCardName?: string;
}

export interface FixedExpenseUpdateFiledDTO extends Omit<
  FixedExpenseDTO, 'id' | 'creditCardName'
> { }

export interface FixedExpenseIdDTO {
  id: string;
}

export interface CreateDTO extends Omit<FixedExpenseDTO, 'id' | 'creditCardName'> {
  userId: string;
}

export interface DeleteDTO extends FixedExpenseIdDTO { userId: string; }

export interface GetByIdDTO extends FixedExpenseIdDTO { userId: string; }

export interface UpdateDTO {
  request: GetByIdDTO;
  fieldUpdate: FixedExpenseUpdateFiledDTO;
}