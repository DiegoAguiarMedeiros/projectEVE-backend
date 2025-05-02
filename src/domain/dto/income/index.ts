export interface IncomeDTO {
    id: string;
    userId: string;
    description: string;
    amount: number;
    paymentDay: number;
}


export interface IncomeUpdateFiledDTO extends Omit<
  IncomeDTO,  'id' | 'userId'
> { }

export interface IncomeIdDTO extends Omit<
  IncomeDTO, 'description' | 'amount' | 'paymentDay'
> { }

export interface CreateDTO extends Omit<IncomeDTO, 'id'> { }

export interface DeleteDTO extends IncomeIdDTO { }

export interface GetByIdDTO extends IncomeIdDTO { }

export interface UpdateDTO {
  request: GetByIdDTO;
  fieldUpdate: IncomeUpdateFiledDTO;
}