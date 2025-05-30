import { Flags } from "../domain/Flags";


export interface CreditCardDTO {
  id: string;
  name: string;
  flag: Flags;
  active: boolean;
  userId: string;
}


export interface CreditCardUpdateFiledDTO extends Omit<
  CreditCardDTO,  'id' | 'userId'
> { }

export interface CreditCardIdDTO extends Omit<
  CreditCardDTO, 'name' | 'flag' | 'active'
> { }

export interface CreateDTO extends Omit<CreditCardDTO, 'id'> { }

export interface DeleteDTO extends CreditCardIdDTO { }

export interface GetByIdDTO extends CreditCardIdDTO { }

export interface UpdateDTO {
  request: GetByIdDTO;
  fieldUpdate: CreditCardUpdateFiledDTO;
}