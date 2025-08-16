
import { TransactionsType } from "../domain/TransactionsType";
import { PaymentMethod, TransactionsStatus } from "../domain";


export interface TransactionsDTO {
  id: string;
  envelopeId: string;
  description: string;
  amount: number;
  date: Date;
  paymentMethod: PaymentMethod;
  type: TransactionsType;
  status: TransactionsStatus;
}



export interface TransactionsUpdateFiledDTO extends Omit<
  TransactionsDTO, 'id' | 'envelopeId'
> { }
export interface TransactionsUpdateStatusDTO extends Omit<
  TransactionsDTO, 'id' | 'description' | 'amount' | 'date' | 'type'| 'paymentMethod' | 'envelopeId'
> { }

export interface TransactionsIdDTO extends Omit<
  TransactionsDTO, 'description' | 'amount' | 'date' | 'type' | 'status' | 'paymentMethod' | 'envelopeId'
> { }

export interface CreateDTO extends Omit<TransactionsDTO, 'id'> {
  userId: string;
 }
export interface DeleteDTO extends TransactionsIdDTO { userId: string; }

export interface GetByIdDTO extends TransactionsIdDTO { userId: string; }

export interface UpdateDTO {
  request: GetByIdDTO;
  fieldUpdate: TransactionsUpdateFiledDTO;
}

export interface UpdateStatusDTO {
  request: GetByIdDTO;
  fieldUpdate: TransactionsUpdateStatusDTO;
}