
export interface BaseEnvelopeDTO {
  name: string;
  id: string;
}

export interface EnvelopeDTO {
  id: string;
  name: string;
  balance: number;
  disable: boolean;
  userId: string;
}