import { useGameStore } from '../store/useGameStore';

const STUB_MESSAGE = "🐙 Psst! Mnemonic hints are coming soon — for now, try counting on your fins!";

export function getMnemonic(tableN: number, multiplier: number): string {
  const facts = useGameStore.getState().facts;
  const fact = facts.find(f => f.tableN === tableN && f.multiplier === multiplier);
  if (fact?.mnemonic) return fact.mnemonic;
  return STUB_MESSAGE;
}
