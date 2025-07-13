export interface IncomesDTO {
    id: string;
    userId: string;
    description: string;
    amount: number;
    paymentDay: number;
}


export interface IncomeUpdateFiledDTO extends Omit<
  IncomesDTO,  'id' | 'userId'
> { }

export interface IncomeIdDTO extends Omit<
  IncomesDTO, 'description' | 'amount' | 'paymentDay'
> { }

export interface CreateDTO extends Omit<IncomesDTO, 'id'> { }

export interface DeleteDTO extends IncomeIdDTO { }

export interface GetByIdDTO extends IncomeIdDTO { }

export interface UpdateDTO {
  request: GetByIdDTO;
  fieldUpdate: IncomeUpdateFiledDTO;
}