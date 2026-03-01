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

interface TableCompleteScreenProps {
  tableN: number;
  onBack: () => void;
}

export default function TableCompleteScreen({ tableN, onBack }: TableCompleteScreenProps) {
  const creature = CREATURES[tableN];

  const bubbles = Array.from({ length: 35 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: Math.random() * 40 + 10,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
  }));

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0a2e4a 0%, #0d5c8a 50%, #1e8bc3 100%)' }}
    >
      {/* Rising bubbles */}
      {bubbles.map(b => (
        <motion.div
          key={b.id}
          className="absolute rounded-full bg-white/20 border border-white/30"
          style={{
            left: `${b.x}%`,
            bottom: '-50px',
            width: b.size,
            height: b.size,
          }}
          animate={{
            y: [0, -window.innerHeight - 100],
            opacity: [0.6, 0],
          }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full gap-6 px-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.3, 1] }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-9xl"
          style={{
            filter: 'drop-shadow(0 0 30px rgba(255, 215, 0, 0.8))',
            animation: 'float 3s ease-in-out infinite',
          }}
        >
          {creature.emoji}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-4xl font-black mb-2 text-yellow-300">
            🎉 Amazing!
          </h1>
          <h2 className="text-2xl font-bold text-white mb-1">
            You've mastered the ×{tableN} table!
          </h2>
          <p className="text-blue-200 text-lg">
            The {creature.name} is yours! 🌊
          </p>
        </motion.div>

        <motion.div
          className="flex gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {Array.from({ length: 5 }, (_, i) => (
            <motion.span
              key={i}
              className="text-3xl"
              animate={{ y: [0, -15, 0] }}
              transition={{ delay: i * 0.1, duration: 0.6, repeat: Infinity, repeatDelay: 1 }}
            >
              ⭐
            </motion.span>
          ))}
        </motion.div>

        <motion.button
          onClick={onBack}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 font-black text-xl text-ocean-deep shadow-xl"
        >
          Back to Ocean Map 🗺️
        </motion.button>
      </div>
    </div>
  );
}
