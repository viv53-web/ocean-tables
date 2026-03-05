export interface Level {
  title: string;
  minXP: number;
  emoji: string;
}

export const LEVELS: Level[] = [
  { title: 'Plankton', minXP: 0, emoji: '🦠' },
  { title: 'Little Shrimp', minXP: 100, emoji: '🦐' },
  { title: 'Swimming Seahorse', minXP: 300, emoji: '🐠' },
  { title: 'Clever Clownfish', minXP: 600, emoji: '🐡' },
  { title: 'Speedy Squid', minXP: 1000, emoji: '🦑' },
  { title: 'Dashing Dolphin', minXP: 1500, emoji: '🐬' },
  { title: 'Grand Whale', minXP: 2500, emoji: '🐋' },
  { title: 'Ocean Explorer', minXP: 4000, emoji: '🤿' },
  { title: 'Master of the Deep', minXP: 6000, emoji: '🔱' },
  { title: 'Poseidon\'s Heir', minXP: 10000, emoji: '🌊' },
];

export function getLevel(xp: number): Level {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

export function getNextLevelXP(xp: number): number | null {
  for (let i = 0; i < LEVELS.length; i++) {
    if (LEVELS[i].minXP > xp) {
      return LEVELS[i].minXP;
    }
  }
  return null;
}
