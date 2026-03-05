import { create } from 'zustand';
import type { AppState, FactRecord } from '../types';
import { buildInitialFacts, updateFact } from '../engine/sm2';

const STORAGE_KEY = 'mathgame_v1';

interface GameStore extends AppState {
  completeSetup: (masteredTables: number[], pin: string) => void;
  answerFact: (fact: FactRecord, correct: boolean) => void;
  recordTime: (tableN: number, type: 'ascending' | 'descending' | 'random', timeMs: number) => void;
  updateMasteredTables: (tables: number[]) => void;
  resetProgress: () => void;
  setParentPin: (pin: string) => void;
  updateFactMnemonic: (tableN: number, multiplier: number, mnemonic: string) => void;
}

function loadState(): Partial<AppState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return {};
}

function saveState(state: AppState) {
  try {
    const { hasCompletedSetup, masteredTables, facts, pearls, experience, streak, lastSessionDate, parentPin, timerBestTimes } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      hasCompletedSetup, masteredTables, facts, pearls, experience, streak, lastSessionDate, parentPin, timerBestTimes,
    }));
  } catch {
    // ignore
  }
}

const defaultState: AppState = {
  hasCompletedSetup: false,
  masteredTables: [],
  facts: [],
  pearls: 0,
  experience: 0,
  streak: 0,
  lastSessionDate: '',
  parentPin: '',
  timerBestTimes: {},
};

const saved = loadState();

export const useGameStore = create<GameStore>((set, get) => ({
  ...defaultState,
  ...saved,

  completeSetup(masteredTables, pin) {
    const facts = buildInitialFacts(masteredTables);
    const newState: AppState = {
      hasCompletedSetup: true,
      masteredTables,
      facts,
      pearls: 0,
      experience: 0,
      streak: 0,
      lastSessionDate: '',
      parentPin: pin,
      timerBestTimes: {},
    };
    set(newState);
    saveState(newState);
  },

  answerFact(fact, correct) {
    const state = get();
    const today = new Date().toDateString();
    let { streak, lastSessionDate, experience } = state;

    // Update streak and experience
    if (correct) {
      experience += 10; // 10 XP per correct answer
      if (lastSessionDate !== today) {
        streak = lastSessionDate === new Date(Date.now() - 86_400_000).toDateString()
          ? streak + 1
          : 1;
      }
    }

    const pearlsEarned = correct ? (streak >= 5 ? 2 : 1) : 0;

    const updatedFact = updateFact(fact, correct);
    const facts = state.facts.map(f =>
      f.tableN === fact.tableN && f.multiplier === fact.multiplier ? updatedFact : f
    );

    const newState: AppState = {
      ...state,
      facts,
      pearls: state.pearls + pearlsEarned,
      experience,
      streak: correct ? state.streak + 1 : 0,
      lastSessionDate: today,
    };

    set(newState);
    saveState(newState);
  },

  recordTime(tableN, type, timeMs) {
    const state = get();
    const currentBest = state.timerBestTimes[tableN]?.[type];
    if (!currentBest || timeMs < currentBest) {
      const newTimes = {
        ...state.timerBestTimes,
        [tableN]: {
          ...state.timerBestTimes[tableN],
          [type]: timeMs
        }
      };
      const experience = state.experience + 50; // Bonus for completion
      const newState = { ...state, timerBestTimes: newTimes, experience };
      set(newState);
      saveState(newState);
    }
  },

  updateMasteredTables(tables) {
    const state = get();
    // Remove facts for newly mastered tables, add facts for newly unmastered tables
    const prevMastered = state.masteredTables;
    const newlyMastered = tables.filter(t => !prevMastered.includes(t));
    const newlyUnmastered = prevMastered.filter(t => !tables.includes(t));

    let facts = state.facts.filter(f => !newlyMastered.includes(f.tableN));
    const newFacts = buildInitialFacts(newlyUnmastered.filter(t => !tables.includes(t)));
    facts = [...facts, ...newFacts];

    const newState: AppState = { ...state, masteredTables: tables, facts };
    set(newState);
    saveState(newState);
  },

  resetProgress() {
    const state = get();
    const facts = buildInitialFacts(state.masteredTables);
    const newState: AppState = {
      ...state,
      facts,
      pearls: 0,
      experience: 0,
      streak: 0,
      lastSessionDate: '',
      timerBestTimes: {},
    };
    set(newState);
    saveState(newState);
  },

  setParentPin(pin) {
    const state = get();
    const newState: AppState = { ...state, parentPin: pin };
    set(newState);
    saveState(newState);
  },

  updateFactMnemonic(tableN, multiplier, mnemonic) {
    const state = get();
    const facts = state.facts.map(f =>
      f.tableN === tableN && f.multiplier === multiplier ? { ...f, mnemonic } : f
    );
    const newState: AppState = { ...state, facts };
    set(newState);
    saveState(newState);
  },
}));
