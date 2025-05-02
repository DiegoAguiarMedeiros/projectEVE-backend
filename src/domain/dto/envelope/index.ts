export interface EnvelopeDTO {
  id: string;
  name: string;
  balance: number;
  color: string;
  percentage: number;
  active: boolean;
  is_editable: boolean;
  userId: string;
}

export interface BaseEnvelopeDTO {
  name: string;
  id: string;
}

export interface EnvelopeWithoutIdDTO extends Omit<
  EnvelopeDTO, 'id'
> { }
export interface EnvelopeUpdateFiledDTO extends Omit<
  EnvelopeDTO, 'id' | 'balance' | 'is_editable' | 'userId'
> { }

export interface EnvelopeIdDTO extends Omit<
  EnvelopeDTO, 'name' | 'balance' | 'color' | 'percentage' | 'active' | 'is_editable'
> { }

export interface CreateDTO extends EnvelopeWithoutIdDTO { }

export interface DeleteDTO extends EnvelopeIdDTO { }

export interface GetByIdDTO extends EnvelopeIdDTO { }

export interface UpdateDTO {
  request: GetByIdDTO;
  fieldUpdate: EnvelopeUpdateFiledDTO;
}