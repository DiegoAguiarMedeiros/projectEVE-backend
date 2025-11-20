export interface ProcessedIncomesDTO {
  id: string;
  userId: string;
  description: string;
  day: number;
  month: number;
  year: number;
  totalIncomeProcessed: number;
  auxId?: string;
  processedAt: Date;
  isReprocessed: boolean;
  isSplitted: boolean;
}


export interface ProcessedIncomeUpdateFiledDTO extends Omit<
  ProcessedIncomesDTO, 'id' | 'userId' | 'day' | 'month' | 'year' |  'processedAt' 
> { }

export interface ProcessedIncomeIdDTO extends Omit<
  ProcessedIncomesDTO, 'day' | 'month' | 'year' | 'totalIncomeProcessed' | 'processedAt' | 'isReprocessed' | 'isSplitted' | 'description'
> { }

export interface CreateDTO extends Omit<ProcessedIncomesDTO, 'id' | 'processedAt' | 'isReprocessed'> {
}

export interface DeleteDTO extends ProcessedIncomeIdDTO { }

export interface GetByIdDTO extends ProcessedIncomeIdDTO {
}

export interface UpdateDTO {
  request: GetByIdDTO;
  fieldUpdate: ProcessedIncomeUpdateFiledDTO;
}

export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type YearMonths = {
  [year: number]: Month[];
};

export type ToalByYearMonths = {
  total: number
};

