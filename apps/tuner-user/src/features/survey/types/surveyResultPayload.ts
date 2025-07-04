export interface OptionStat {
  label: string;
  percentage: number;
}

export interface GroupResult {
  user_group: string;
  question: string;
  options: OptionStat[];
}

export interface SummaryStats {
  [key: string]: number;
}
