export interface CreateEnvelopeDTO {
  name: string;
  balance: number;
  active: boolean;
  is_deletable: boolean;
  userId: string;
}