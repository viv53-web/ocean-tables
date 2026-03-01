import { motion } from 'framer-motion';

const CREATURES: Record<number, { emoji: string; name: string }> = {
  1:  { emoji: '⭐', name: 'Starfish' },
  2:  { emoji: '🪼', name: 'Jellyfish' },
  3:  { emoji: '🦀', name: 'Crab' },
  4:  { emoji: '🐠', name: 'Seahorse' },
  5:  { emoji: '🐬', name: 'Dolphin' },
  6:  { emoji: '🐙', name: 'Octopus' },
  7:  { emoji: '🦈', name: 'Shark' },
  8:  { emoji: '🐋', name: 'Whale' },
  9:  { emoji: '🐢', name: 'Turtle' },
  10: { emoji: '🐟', name: 'Manta Ray' },
  11: { emoji: '🐡', name: 'Clownfish' },
  12: { emoji: '🦄', name: 'Narwhal' },
};

interface SeaCreatureProps {
  tableN: number;
  masteryLevel: number;
  isMastered: boolean;
  onClick: () => void;
}

export default function SeaCreature({ tableN, masteryLevel, isMastered, onClick }: SeaCreatureProps) {
  const creature = CREATURES[tableN];
  const grayscale = isMastered ? 0 : Math.max(0, 1 - masteryLevel);
  const opacity = isMastered ? 1 : 0.4 + masteryLevel * 0.6;

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className={`
        flex flex-col items-center gap-1 p-3 rounded-2xl cursor-pointer
        bg-white/10 backdrop-blur border border-white/20
        transition-all duration-300
        ${isMastered ? 'creature-glow border-yellow-400/50' : ''}
      `}
      style={{
        filter: `grayscale(${grayscale}) opacity(${opacity})`,
        boxShadow: isMastered ? '0 0 20px rgba(255, 215, 0, 0.6)' : undefined,
      }}
      animate={isMastered ? { y: [0, -6, 0] } : {}}
      transition={isMastered ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } : {}}
    >
      <span className="text-5xl leading-none">{creature.emoji}</span>
      <div className="text-center">
        <div className="font-bold text-sm">×{tableN}</div>
        <div className="text-xs opacity-75">{creature.name}</div>
      </div>
      {masteryLevel > 0 && !isMastered && (
        <div className="w-full bg-white/20 rounded-full h-1.5 mt-1">
          <div
            className="bg-blue-400 h-1.5 rounded-full transition-all"
            style={{ width: `${masteryLevel * 100}%` }}
          />
        </div>
      )}
    </motion.button>
  );
}
