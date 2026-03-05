export interface FactRecord {
  tableN: number;
  multiplier: number;
  easeFactor: number;
  interval: number;
  dueAt: number;
  mastery: number;
  timesAnswered: number;
  mnemonic?: string;
}

export interface TimerBest {
  ascending?: number; // time in ms
  descending?: number; // time in ms
  random?: number; // time in ms
}

export interface AppState {
  hasCompletedSetup: boolean;
  masteredTables: number[];
  facts: FactRecord[];
  pearls: number;
  experience: number;
  streak: number;
  lastSessionDate: string;
  parentPin: string;
  timerBestTimes: Record<number, TimerBest>;
}

export type Screen = 'setup' | 'home' | 'drill' | 'tableComplete' | 'settings';
