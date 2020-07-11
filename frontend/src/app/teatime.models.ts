export enum Level {
  Junior = 1,
  Mid,
  Senior,
}

export interface TeaMaker {
  id: string;
  first_name: string;
  last_name: string;
  level: Level
}

export interface Tea {
  timestamp: Date;
  made_by: TeaMaker;
  voided: boolean;
}
