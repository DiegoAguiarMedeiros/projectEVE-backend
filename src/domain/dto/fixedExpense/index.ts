export interface FixedExpenseDTO {
    id: string;
    envelopeId: string;
    description: string;
    amount: number;
    paymentDay: number;
}

export interface FixedExpenseUpdateFiledDTO extends Omit<
FixedExpenseDTO, 'id' 
> { }

export interface FixedExpenseIdDTO extends Omit<
    FixedExpenseDTO, 'envelopeId' | 'description' | 'amount' | 'paymentDay'
> { }

export interface CreateDTO extends Omit<FixedExpenseDTO, 'id'> { }

export interface DeleteDTO extends FixedExpenseIdDTO { userId: string; }

export interface GetByIdDTO extends FixedExpenseIdDTO { userId: string; }

export interface UpdateDTO {
  request: GetByIdDTO;
  fieldUpdate: FixedExpenseUpdateFiledDTO;
}