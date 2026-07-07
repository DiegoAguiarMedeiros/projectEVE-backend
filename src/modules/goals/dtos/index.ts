export interface GoalsDTO {
  id: string;
  envelopeId: string;
  description: string;
  amount: number;
  amountTotal: number;
  percentage: number;
  deadline: number;
  monthYear: boolean;
}

export interface GoalsUpdateFiledDTO extends Omit<
  GoalsDTO, 'id' | 'envelopeId'
> { }

export interface GoalsIdDTO extends Omit<
  GoalsDTO, 'envelopeId' | 'description' | 'amount' | 'amountTotal' | 'deadline' | 'percentage' | 'monthYear'
> { }

export interface CreateDTO extends Omit<GoalsDTO, 'id'| 'envelopeId'> {
  userId: string;
}

export interface DeleteDTO extends GoalsIdDTO { userId: string; }

export interface GetByIdDTO extends GoalsIdDTO { userId: string; }

export interface UpdateDTO {
  request: GetByIdDTO;
  fieldUpdate: GoalsUpdateFiledDTO;
}
