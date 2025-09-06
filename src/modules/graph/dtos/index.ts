export interface AnalyticsCurrentEnvelopesDTO {
  labels?: string[];
  colors?: string[];
  values?: number[];
  subValues?: number[];
}
export interface AnalyticsEnvelopesByYearDTO {
  categories: string[];
  series: {
    name: string;
    data: number[];
  }[];
};

export interface AnalyticsEnvelopesMonthOverviewDTO {
  title: string;
  total: number;
  icon: "CallMadeIcon" | "SavingsIcon" | "SouthEastIcon" | "AttachMoneyIcon" ;
  color: "primary" | "secondary" | "info" | "warning" | "success" | "error";
}