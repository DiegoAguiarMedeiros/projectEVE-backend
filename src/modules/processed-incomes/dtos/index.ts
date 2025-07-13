export interface ProcessedIncomesDTO {
  id: string;
  userId: string;
  month: number;
  year: number;
  totalIncomeProcessed: number;
  auxId?: string;
  processedAt: Date;
  isReprocessed: boolean;
  isSplitted: boolean;
}


export interface ProcessedIncomeUpdateFiledDTO extends Omit<
  ProcessedIncomesDTO, 'id' | 'userId' | 'month' | 'year' | 'totalIncomeProcessed' | 'processedAt' | 'isSplitted'
> { }

export interface ProcessedIncomeIdDTO extends Omit<
  ProcessedIncomesDTO, 'userId' | 'month' | 'year' | 'totalIncomeProcessed' | 'processedAt' | 'isReprocessed' | 'isSplitted'
> { }

export interface CreateDTO extends Omit<ProcessedIncomesDTO, 'id' | 'processedAt' | 'isReprocessed'> {
}

export interface DeleteDTO extends ProcessedIncomeIdDTO { }

export interface GetByIdDTO extends ProcessedIncomeIdDTO { }

export interface UpdateDTO {
  request: GetByIdDTO;
  fieldUpdate: ProcessedIncomeUpdateFiledDTO;
}