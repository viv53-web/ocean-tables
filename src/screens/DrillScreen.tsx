import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FactRecord } from '../types';
import { useGameStore } from '../store/useGameStore';
import { getNextFact, getMasteryForTable } from '../engine/sm2';
import DotArray from '../components/DotArray';
import NumPad from '../components/NumPad';
import MnemonicOverlay from '../components/MnemonicOverlay';
import PearlCounter from '../components/PearlCounter';
import BubbleBackground from '../components/BubbleBackground';

interface DrillScreenProps {
  tableN: number;
  onBack: () => void;
  onTableComplete: (tableN: number) => void;
}

type Phase = 'questioning' | 'revealed';

export default function DrillScreen({ tableN, onBack, onTableComplete }: DrillScreenProps) {
  const facts = useGameStore(s => s.facts);
  const answerFact = useGameStore(s => s.answerFact);
  const streak = useGameStore(s => s.streak);

  const [currentFact, setCurrentFact] = useState<FactRecord | null>(null);
  const [userInput, setUserInput] = useState('');
  const [phase, setPhase] = useState<Phase>('questioning');
  const [wasCorrect, setWasCorrect] = useState<boolean | null>(null);
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [pearlToast, setPearlToast] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Pick facts for this table only
  const tableFacts = facts.filter(f => f.tableN === tableN);

  useEffect(() => {
    loadNextFact();
    
    // Detect if we should use the custom numpad (mobile)
    const mql = window.matchMedia('(max-width: 767px)');
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const loadNextFact = () => {
    const currentFacts = useGameStore.getState().facts.filter(f => f.tableN === tableN);
    const next = getNextFact(currentFacts);
    setCurrentFact(next);
    setUserInput('');
    setPhase('questioning');
    setWasCorrect(null);
  };

  const handleSubmit = () => {
    if (!currentFact || phase !== 'questioning') return;
    const answer = parseInt(userInput, 10);
    const correct = answer === currentFact.tableN * currentFact.multiplier;

    setWasCorrect(correct);
    setPhase('revealed');
    answerFact(currentFact, correct);

    if (correct) {
      setPearlToast(true);
      setTimeout(() => setPearlToast(false), 1500);
    }

    // Check if table is now complete
    setTimeout(() => {
      const updatedFacts = useGameStore.getState().facts.filter(f => f.tableN === tableN);
      const mastery = getMasteryForTable(updatedFacts, tableN);
      if (mastery >= 0.8) {
        setTimeout(() => onTableComplete(tableN), 800);
      }
    }, 100);
  };

  const handleNext = () => {
    loadNextFact();
    // Only auto-focus if not on mobile, or always focus but inputMode="none" will handle it
    inputRef.current?.focus();
  };

  if (!currentFact && tableFacts.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <BubbleBackground />
        <div className="relative z-10 text-center">
          <p className="text-2xl font-bold mb-4">No facts to drill for ×{tableN}!</p>
          <button onClick={onBack} className="px-6 py-3 bg-blue-600 rounded-xl font-bold">
            Back to Ocean Map
          </button>
        </div>
      </div>
    );
  }

  if (!currentFact) return null;

  // Orient dot array: smaller dimension as rows
  const dotRows = Math.min(currentFact.tableN, currentFact.multiplier);
  const dotCols = Math.max(currentFact.tableN, currentFact.multiplier);

  return (
    <div className="relative min-h-screen flex flex-col">
      <BubbleBackground />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-4 pb-2">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors font-semibold"
        >
          ← Ocean Map
        </button>
        <span className="font-bold text-blue-200">×{tableN} table</span>
        <PearlCounter />
      </div>

      {/* Pearl toast */}
      <AnimatePresence>
        {pearlToast && (
          <motion.div
            className="fixed top-16 right-4 z-50 bg-yellow-500 text-white font-bold px-4 py-2 rounded-full shadow-lg"
            initial={{ opacity: 0, y: -10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
          >
            +{streak >= 4 ? 2 : 1} 🦪 {streak >= 4 ? '🔥 Streak bonus!' : ''}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 gap-6 pb-8">
        {/* Question card */}
        <motion.div
          className="w-full max-w-sm"
          animate={
            phase === 'revealed' && !wasCorrect
              ? { x: [-8, 8, -8, 8, 0] }
              : phase === 'revealed' && wasCorrect
              ? { scale: [1, 1.05, 1] }
              : {}
          }
          transition={{ duration: 0.4 }}
        >
          <div
            className={`
              rounded-3xl p-6 text-center border-2 transition-all duration-300
              ${phase === 'revealed' && wasCorrect
                ? 'bg-green-500/30 border-green-400'
                : phase === 'revealed' && !wasCorrect
                ? 'bg-red-500/20 border-red-400'
                : 'bg-white/10 border-white/20'
              }
            `}
          >
            <p className="text-6xl font-black tracking-wide">
              {currentFact.tableN} × {currentFact.multiplier} = ?
            </p>

            {phase === 'revealed' && !wasCorrect && (
              <motion.p
                className="text-2xl font-bold text-red-300 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Answer: {currentFact.tableN * currentFact.multiplier}
              </motion.p>
            )}
            {phase === 'revealed' && wasCorrect && (
              <motion.p
                className="text-2xl font-bold text-green-300 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {currentFact.tableN * currentFact.multiplier} ✓
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Dot array */}
        <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/20 w-full max-w-sm">
          <DotArray
            rows={dotRows}
            cols={dotCols}
            highlight={phase === 'revealed' ? (wasCorrect ? 'correct' : 'wrong') : null}
          />
        </div>

        {/* Input area */}
        {phase === 'questioning' ? (
          <div className="w-full max-w-sm flex flex-col gap-3">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                inputMode={isMobile ? 'none' : 'numeric'}
                value={userInput}
                onChange={e => setUserInput(e.target.value.replace(/\D/g, '').slice(0, 3))}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="Your answer..."
                autoFocus
                className="flex-1 bg-white/20 rounded-xl px-4 py-3 text-2xl font-bold text-center outline-none border border-white/30 focus:border-cyan-400 transition-colors placeholder-white/40"
              />
              <button
                onClick={handleSubmit}
                disabled={!userInput}
                className="px-5 py-3 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 rounded-xl font-bold text-lg transition-colors"
              >
                ✓
              </button>
            </div>

            <button
              onClick={() => setShowMnemonic(true)}
              className="text-blue-300 hover:text-blue-100 text-sm font-semibold transition-colors text-center"
            >
              🧠 Help me remember
            </button>

            <NumPad
              value={userInput}
              onChange={setUserInput}
              onSubmit={handleSubmit}
            />
          </div>
        ) : (
          <motion.button
            onClick={handleNext}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl font-black text-xl shadow-lg"
          >
            Next →
          </motion.button>
        )}
      </div>

      {showMnemonic && currentFact && (
        <MnemonicOverlay
          tableN={currentFact.tableN}
          multiplier={currentFact.multiplier}
          onClose={() => setShowMnemonic(false)}
        />
      )}
    </div>
  );
}
