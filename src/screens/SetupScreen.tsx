import { useState } from 'react';
import { motion } from 'framer-motion';
import BubbleBackground from '../components/BubbleBackground';
import { useGameStore } from '../store/useGameStore';

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

export default function SetupScreen() {
  const completeSetup = useGameStore(s => s.completeSetup);
  const [mastered, setMastered] = useState<number[]>([]);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');

  const toggle = (n: number) => {
    setMastered(prev =>
      prev.includes(n) ? prev.filter(x => x !== n) : [...prev, n]
    );
  };

  const handleDiveIn = () => {
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      setPinError('Please enter a 4-digit PIN');
      return;
    }
    completeSetup(mastered, pin);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center px-4 py-8">
      <BubbleBackground />

      <motion.div
        className="relative z-10 w-full max-w-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black mb-2">Welcome to Ocean Tables! 🌊</h1>
          <p className="text-blue-200 text-base leading-relaxed">
            Parents: tick the times tables your child already knows — we'll focus on the rest.
          </p>
        </div>

        {/* Table selection */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {Array.from({ length: 12 }, (_, i) => i + 1).map(n => {
            const c = CREATURES[n];
            const checked = mastered.includes(n);
            return (
              <motion.button
                key={n}
                onClick={() => toggle(n)}
                whileTap={{ scale: 0.95 }}
                className={`
                  flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all
                  ${checked
                    ? 'bg-green-500/30 border-green-400 shadow-lg shadow-green-900/30'
                    : 'bg-white/10 border-white/20 hover:bg-white/15'
                  }
                `}
              >
                <span className="text-3xl">{c.emoji}</span>
                <span className="font-bold text-sm">×{n} {c.name}</span>
                <span className={`text-xs font-semibold ${checked ? 'text-green-300' : 'text-blue-300'}`}>
                  {checked ? '✓ Mastered' : 'Not yet'}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* PIN */}
        <div className="bg-white/10 backdrop-blur rounded-2xl p-5 mb-6 border border-white/20">
          <label className="block font-bold mb-2 text-yellow-200">
            🔐 Choose a 4-digit parent PIN
          </label>
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={pin}
            onChange={e => {
              setPinError('');
              setPin(e.target.value.replace(/\D/g, '').slice(0, 4));
            }}
            placeholder="• • • •"
            className="w-full bg-white/20 rounded-xl px-4 py-3 text-xl font-bold text-center tracking-widest outline-none border border-white/30 focus:border-yellow-400 transition-colors placeholder-white/40"
          />
          {pinError && <p className="text-red-300 text-sm mt-1">{pinError}</p>}
        </div>

        {mastered.length === 12 && (
          <div className="bg-yellow-500/20 border border-yellow-400/40 rounded-xl p-3 mb-4 text-center text-sm text-yellow-200">
            All tables marked as mastered — the app will drill all 12 to keep sharp!
          </div>
        )}

        <motion.button
          onClick={handleDiveIn}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 font-black text-xl shadow-lg shadow-blue-900/50 hover:shadow-blue-900/70 transition-shadow"
        >
          Dive In! 🤿
        </motion.button>
      </motion.div>
    </div>
  );
}
