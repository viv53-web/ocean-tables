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

export interface AppState {
  hasCompletedSetup: boolean;
  masteredTables: number[];
  facts: FactRecord[];
  pearls: number;
  streak: number;
  lastSessionDate: string;
  parentPin: string;
}

export type Screen = 'setup' | 'home' | 'drill' | 'tableComplete' | 'settings';
