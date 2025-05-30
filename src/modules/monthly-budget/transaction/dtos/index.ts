
import { EnvelopeDTO, EnvelopeIdDTO } from "../../../budgeting/envelope/dtos";
import { PaymentMethod, TransactionStatus, TransactionType } from "../domain";


export interface TransactionDTO {
    id: string;
    creditCardId?: string;
    envelope: EnvelopeDTO;
    description: string;
    amount: number;
    paymentMethod: PaymentMethod;
    date: Date;
    type: TransactionType;
    status: TransactionStatus;
}



export interface TransactionUpdateFiledDTO extends Omit<
  TransactionDTO,  'id' 
> { }
export interface TransactionUpdateStatusDTO extends Omit<
  TransactionDTO,  'id' | 'creditCardId' | 'envelope' | 'description' | 'amount' | 'paymentMethod' | 'date' | 'type'
> { }

export interface TransactionIdDTO extends Omit<
  TransactionDTO, 'creditCardId' | 'envelope' | 'description' | 'amount' | 'paymentMethod' | 'date' | 'type' | 'status'
> { }

export interface CreateDTO extends Omit<TransactionDTO, 'id' | 'envelope'> {
  envelope: EnvelopeIdDTO;
}
export interface DeleteDTO extends TransactionIdDTO { userId: string; }

export interface GetByIdDTO extends TransactionIdDTO { userId: string; }

export interface UpdateDTO {
  request: GetByIdDTO;
  fieldUpdate: TransactionUpdateFiledDTO;
}

export interface UpdateStatusDTO {
  request: GetByIdDTO;
  fieldUpdate: TransactionUpdateStatusDTO;
}