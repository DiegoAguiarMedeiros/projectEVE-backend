import { PaymentMethod } from "../../entities/transaction/PaymentMethod";
import { TransactionStatus } from "../../entities/transaction/TransactionStatus";
import { TransactionType } from "../../entities/transaction/TransactionType";
import { EnvelopeDTO, EnvelopeIdDTO } from "../envelope";


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