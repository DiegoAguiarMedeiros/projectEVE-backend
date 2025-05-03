import { EnvelopeDTO, EnvelopeIdDTO } from "../envelope";

export interface FixedExpenseDTO {
  id: string;
  envelope: EnvelopeDTO;
  description: string;
  amount: number;
  paymentDay: number;
}

export interface FixedExpenseUpdateFiledDTO extends Omit<
  FixedExpenseDTO, 'id'
> { }

export interface FixedExpenseIdDTO extends Omit<
  FixedExpenseDTO, 'envelope' | 'description' | 'amount' | 'paymentDay'
> { }

export interface CreateDTO extends Omit<FixedExpenseDTO, 'id' | 'envelope'> {
  envelope: EnvelopeIdDTO;
}

export interface DeleteDTO extends FixedExpenseIdDTO { userId: string; }

export interface GetByIdDTO extends FixedExpenseIdDTO { userId: string; }

export interface UpdateDTO {
  request: GetByIdDTO;
  fieldUpdate: FixedExpenseUpdateFiledDTO;
}