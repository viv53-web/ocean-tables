import type { FactRecord } from '../types';

const DAY_MS = 86_400_000;

export function updateFact(fact: FactRecord, correct: boolean): FactRecord {
  let { easeFactor, interval, mastery } = fact;

  if (correct) {
    if (interval === 0) {
      interval = 1;
    } else if (interval === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    easeFactor = Math.min(easeFactor + 0.1, 2.5);
    mastery = Math.min(mastery + 0.15, 1);
  } else {
    interval = 0;
    easeFactor = Math.max(easeFactor - 0.2, 1.3);
    mastery = Math.max(mastery - 0.1, 0);
  }

  return {
    ...fact,
    easeFactor,
    interval,
    dueAt: Date.now() + interval * DAY_MS,
    mastery,
    timesAnswered: (fact.timesAnswered ?? 0) + 1,
  };
}

export function buildInitialFacts(masteredTables: number[]): FactRecord[] {
  const facts: FactRecord[] = [];
  for (let tableN = 1; tableN <= 12; tableN++) {
    if (masteredTables.includes(tableN)) continue;
    for (let multiplier = 1; multiplier <= 12; multiplier++) {
      facts.push({
        tableN,
        multiplier,
        easeFactor: 2.5,
        interval: 0,
        dueAt: Date.now(),
        mastery: 0,
        timesAnswered: 0,
      });
    }
  }
  return facts;
}

export function getNextFact(facts: FactRecord[]): FactRecord | null {
  if (facts.length === 0) return null;

  // Phase 1 — unseen facts: introduce in order (lowest tableN, then multiplier)
  const unseen = facts.filter(f => (f.timesAnswered ?? 0) === 0);
  if (unseen.length > 0) {
    return unseen.reduce((a, b) =>
      a.tableN < b.tableN || (a.tableN === b.tableN && a.multiplier < b.multiplier) ? a : b
    );
  }

  // Phase 2 — seen facts: pick randomly from what's due, else from all
  const now = Date.now();
  const due = facts.filter(f => f.dueAt <= now);
  const pool = due.length > 0 ? due : facts;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getMasteryForTable(facts: FactRecord[], tableN: number): number {
  const tableFacts = facts.filter(f => f.tableN === tableN);
  if (tableFacts.length === 0) return 0;
  const total = tableFacts.reduce((sum, f) => sum + f.mastery, 0);
  return total / tableFacts.length;
}
