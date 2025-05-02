import { PaymentMethod } from "../../entities/transaction/PaymentMethod";
import { TransactionsStatus } from "../../entities/transaction/TransactionsStatus";
import { TransactionsType } from "../../entities/transaction/TransactionsType";


export interface TransactionDTO {
    id: string;
    creditCardId?: string;
    envelopeId: string;
    description: string;
    amount: number;
    paymentMethod: PaymentMethod;
    date: Date;
    type: TransactionsType;
    status: TransactionsStatus;
}



export interface TransactionUpdateFiledDTO extends Omit<
  TransactionDTO,  'id' 
> { }

export interface TransactionIdDTO extends Omit<
  TransactionDTO, 'creditCardId' | 'envelopeId' | 'description' | 'amount' | 'paymentMethod' | 'date' | 'type' | 'status'
> { }

export interface CreateDTO extends Omit<TransactionDTO, 'id'> { userId: string; }

export interface DeleteDTO extends TransactionIdDTO { userId: string; }

export interface GetByIdDTO extends TransactionIdDTO { userId: string; }

export interface UpdateDTO {
  request: GetByIdDTO;
  fieldUpdate: TransactionUpdateFiledDTO;
}