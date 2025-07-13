export interface EnvelopesDTO {
  id: string;
  name: string;
  color: string;
  order: number;
  percentage: number;
  userId: string;
}

export interface BaseEnvelopesDTO {
  name: string;
  color: string;
  order: number;
  id: string;
}

export interface EnvelopesWithoutIdDTO extends Omit<
  EnvelopesDTO, 'id'
> { }
export interface EnvelopesUpdateFiledDTO extends Omit<
  EnvelopesDTO, 'id' | 'userId' | 'order'
> { }

export interface EnvelopesIdDTO extends Omit<
  EnvelopesDTO, 'name' | 'color' | 'percentage' | 'order'
> { }

export interface CreateDTO extends EnvelopesWithoutIdDTO { }

export interface DeleteDTO extends EnvelopesIdDTO { }

export interface GetByIdDTO extends EnvelopesIdDTO { }

export interface UpdateDTO {
  request: GetByIdDTO;
  fieldUpdate: EnvelopesUpdateFiledDTO;
}