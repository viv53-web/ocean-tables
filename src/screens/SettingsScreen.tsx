import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

interface SettingsScreenProps {
  onClose: () => void;
}

export default function SettingsScreen({ onClose }: SettingsScreenProps) {
  const parentPin = useGameStore(s => s.parentPin);
  const masteredTables = useGameStore(s => s.masteredTables);
  const updateMasteredTables = useGameStore(s => s.updateMasteredTables);
  const resetProgress = useGameStore(s => s.resetProgress);
  const setParentPin = useGameStore(s => s.setParentPin);

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [localMastered, setLocalMastered] = useState<number[]>(masteredTables);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [saved, setSaved] = useState(false);

  const handlePinSubmit = () => {
    if (pinInput === parentPin) {
      setUnlocked(true);
    } else {
      setPinError('Incorrect PIN. Try again.');
      setPinInput('');
    }
  };

  const toggleMastered = (n: number) => {
    setLocalMastered(prev =>
      prev.includes(n) ? prev.filter(x => x !== n) : [...prev, n]
    );
  };

  const handleSave = () => {
    updateMasteredTables(localMastered);
    if (newPin.length === 4) {
      setParentPin(newPin);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    resetProgress();
    setShowResetConfirm(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm overflow-y-auto py-8 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-md bg-ocean-deep rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <h2 className="text-xl font-black">⚙️ Settings</h2>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-lg transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="p-6">
            {!unlocked ? (
              /* PIN gate */
              <div className="flex flex-col gap-4">
                <p className="text-blue-200 text-sm">Enter your parent PIN to access settings.</p>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={pinInput}
                  onChange={e => {
                    setPinError('');
                    setPinInput(e.target.value.replace(/\D/g, '').slice(0, 4));
                  }}
                  onKeyDown={e => e.key === 'Enter' && handlePinSubmit()}
                  placeholder="• • • •"
                  autoFocus
                  className="w-full bg-white/20 rounded-xl px-4 py-3 text-xl font-bold text-center tracking-widest outline-none border border-white/30 focus:border-cyan-400 transition-colors placeholder-white/40"
                />
                {pinError && <p className="text-red-300 text-sm">{pinError}</p>}
                <button
                  onClick={handlePinSubmit}
                  className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 rounded-xl font-bold transition-colors"
                >
                  Unlock Settings 🔓
                </button>
              </div>
            ) : (
              /* Settings content */
              <div className="flex flex-col gap-6">
                {/* Mastered tables */}
                <div>
                  <h3 className="font-bold text-yellow-200 mb-3">Already Mastered Tables</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(n => {
                      const c = CREATURES[n];
                      const checked = localMastered.includes(n);
                      return (
                        <button
                          key={n}
                          onClick={() => toggleMastered(n)}
                          className={`
                            flex flex-col items-center gap-1 p-2 rounded-xl border-2 text-xs transition-all
                            ${checked
                              ? 'bg-green-500/30 border-green-400'
                              : 'bg-white/10 border-white/20 hover:bg-white/15'
                            }
                          `}
                        >
                          <span className="text-2xl">{c.emoji}</span>
                          <span className="font-bold">×{n}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Change PIN */}
                <div>
                  <h3 className="font-bold text-yellow-200 mb-2">Change Parent PIN</h3>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={newPin}
                    onChange={e => {
                      setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4));
                    }}
                    placeholder="New 4-digit PIN (optional)"
                    className="w-full bg-white/20 rounded-xl px-4 py-2 text-lg font-bold text-center tracking-widest outline-none border border-white/30 focus:border-cyan-400 transition-colors placeholder-white/30"
                  />
                </div>

                {/* Save */}
                <button
                  onClick={handleSave}
                  className={`w-full py-3 rounded-xl font-bold transition-all ${
                    saved
                      ? 'bg-green-500 text-white'
                      : 'bg-cyan-500 hover:bg-cyan-400'
                  }`}
                >
                  {saved ? '✓ Saved!' : 'Save Changes'}
                </button>

                {/* Reset */}
                <div className="border-t border-white/10 pt-4">
                  <h3 className="font-bold text-red-300 mb-2">Danger Zone</h3>
                  {!showResetConfirm ? (
                    <button
                      onClick={() => setShowResetConfirm(true)}
                      className="w-full py-3 rounded-xl border-2 border-red-500/60 text-red-300 hover:bg-red-500/20 font-bold transition-colors"
                    >
                      Reset All Progress 🗑️
                    </button>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <p className="text-red-200 text-sm text-center">
                        This will erase all progress. Are you sure?
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowResetConfirm(false)}
                          className="flex-1 py-2 rounded-xl bg-white/15 font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleReset}
                          className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 font-bold"
                        >
                          Yes, Reset
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
