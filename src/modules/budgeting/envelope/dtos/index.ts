export interface EnvelopeDTO {
  id: string;
  name: string;
  color: string;
  percentage: number;
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
  EnvelopeDTO, 'id' |  'userId'
> { }

export interface EnvelopeIdDTO extends Omit<
  EnvelopeDTO, 'name' |  'color' | 'percentage' 
> { }

export interface CreateDTO extends EnvelopeWithoutIdDTO { }

export interface DeleteDTO extends EnvelopeIdDTO { }

export interface GetByIdDTO extends EnvelopeIdDTO { }

export interface UpdateDTO {
  request: GetByIdDTO;
  fieldUpdate: EnvelopeUpdateFiledDTO;
}