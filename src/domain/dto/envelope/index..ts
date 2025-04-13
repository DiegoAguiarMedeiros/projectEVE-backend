
export interface BaseEnvelopeDTO {
  name: string;
  id: string;
}

export interface EnvelopeDTO {
  id: string;
  name: string;
  balance: number;
  active: boolean;
  is_editable: boolean;
  userId: string;
}