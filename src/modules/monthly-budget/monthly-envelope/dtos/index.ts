export interface MonthlyEnvelopeDTO {
  id: string;
  balance: number;
  percentage: number;
  reference: string;
  envelopeId: string;
}

export interface BaseMonthlyEnvelopeDTO {
  name: string;
  id: string;
}

export interface MonthlyEnvelopeWithoutIdDTO extends Omit<
  MonthlyEnvelopeDTO, 'id'
> { }
export interface MonthlyEnvelopeUpdateFiledDTO extends Omit<
  MonthlyEnvelopeDTO, 'id' | 'reference' | 'envelopeId' | 'balance'
> { }

export interface MonthlyEnvelopeIdDTO extends Omit<
  MonthlyEnvelopeDTO, | 'reference' | 'envelopeId' | 'percentage' | 'balance'
> {
  userId: string;
}

export interface CreateDTO extends MonthlyEnvelopeWithoutIdDTO {}

export interface CreateMonthlyWithTansactionDTO extends MonthlyEnvelopeWithoutIdDTO {
  createMonthlyEnvelope: boolean;
  monthlyEnvelopeId?: string;
  description: string;
  amount: number;
  date: Date;
  debtId: string;
}

export interface DeleteDTO extends MonthlyEnvelopeIdDTO { }

export interface GetByIdDTO extends MonthlyEnvelopeIdDTO {
  userId: string;
}

export interface UpdateDTO {
  request: GetByIdDTO;
  fieldUpdate: MonthlyEnvelopeUpdateFiledDTO;
}