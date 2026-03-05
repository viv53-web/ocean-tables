import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BubbleBackground from '../components/BubbleBackground';
import SeaCreature from '../components/SeaCreature';
import PearlCounter from '../components/PearlCounter';
import { useGameStore } from '../store/useGameStore';
import { getMasteryForTable } from '../engine/sm2';
import { getLevel, getNextLevelXP, LEVELS } from '../utils/levels';

interface HomeScreenProps {
  onStartDrill: (tableN: number, mode?: 'smart' | 'ascending' | 'descending' | 'random') => void;
  onOpenSettings: () => void;
}

export default function HomeScreen({ onStartDrill, onOpenSettings }: HomeScreenProps) {
  const facts = useGameStore(s => s.facts);
  const experience = useGameStore(s => s.experience);
  const masteredTables = useGameStore(s => s.masteredTables);
  const timerBestTimes = useGameStore(s => s.timerBestTimes);

  const [selectedTable, setSelectedTable] = useState<number | null>(null);

  const currentLevel = getLevel(experience);
  const nextXP = getNextLevelXP(experience);
  const prevXP = LEVELS.find((_, i) => LEVELS[i+1]?.minXP === nextXP)?.minXP || 0;
  const progress = nextXP ? ((experience - prevXP) / (nextXP - prevXP)) * 100 : 100;

  const handleCreatureClick = (tableN: number) => {
    setSelectedTable(tableN);
  };

  const startMode = (mode: 'smart' | 'ascending' | 'descending' | 'random') => {
    if (selectedTable) {
      onStartDrill(selectedTable, mode);
      setSelectedTable(null);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col">
      <BubbleBackground />

      {/* Header with Level & Pearls */}
      <div className="relative z-10 flex flex-col px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={onOpenSettings}
            className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-xl transition-colors"
            title="Settings"
          >
            ⚙️
          </button>
          
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-1 rounded-full border border-white/20">
              <span className="text-xl">{currentLevel.emoji}</span>
              <span className="font-black text-sm uppercase tracking-wider">{currentLevel.title}</span>
            </div>
          </div>

          <PearlCounter />
        </div>

        {/* XP Progress Bar */}
        <div className="w-full max-w-xs mx-auto">
          <div className="flex justify-between text-[10px] font-bold text-blue-200 mb-1 px-1">
            <span>XP: {experience}</span>
            {nextXP && <span>Next: {nextXP}</span>}
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col overflow-y-auto">
        <div className="flex-1 flex flex-col justify-center py-8">
          {/* Bigger, Centered Title */}
          <div className="text-center mb-8 px-4">
            <h1 className="text-4xl sm:text-5xl font-black text-white drop-shadow-lg tracking-tight">
              Maya's <span className="text-cyan-300">Ocean Tables</span>
            </h1>
            <p className="text-blue-200 text-sm mt-2 font-medium">
              Tap a creature to choose your challenge!
            </p>
          </div>

          {/* Creatures grid - Centered and Balanced */}
          <div className="px-6 w-full max-w-2xl mx-auto">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 items-center justify-items-center">
              {Array.from({ length: 12 }, (_, i) => i + 1).map(tableN => {
                const isMastered = masteredTables.includes(tableN);
                const mastery = isMastered ? 1 : getMasteryForTable(facts, tableN);
                return (
                  <motion.div
                    key={tableN}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: tableN * 0.04 }}
                    className="w-full"
                  >
                    <SeaCreature
                      tableN={tableN}
                      masteryLevel={mastery}
                      isMastered={isMastered}
                      onClick={() => handleCreatureClick(tableN)}
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Seabed (at the bottom of content) */}
        <div
          className="relative h-20 w-full"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, #f4a261 40%, #e8935a 100%)',
          }}
        >
          {/* Sand ripples */}
          <div className="absolute inset-0 flex items-center justify-around opacity-30">
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                className="rounded-full bg-white/40"
                style={{ width: 40 + i * 10, height: 8 }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mode Selector Modal */}
      <AnimatePresence>
        {selectedTable && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTable(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="relative w-full max-w-sm bg-ocean-deep rounded-3xl border border-white/20 p-6 shadow-2xl overflow-hidden"
            >
              <h3 className="text-2xl font-black mb-1 text-center">×{selectedTable} Challenge</h3>
              <p className="text-blue-200 text-sm text-center mb-6">Choose how you want to play</p>
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => startMode('smart')}
                  className="group flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/10 transition-all"
                >
                  <div className="flex flex-col items-start">
                    <span className="font-bold text-lg">🧠 Smart Review</span>
                    <span className="text-xs text-blue-300">Focus on what's hard for you</span>
                  </div>
                  <span className="text-2xl group-hover:scale-110 transition-transform">🎯</span>
                </button>

                <button
                  onClick={() => startMode('ascending')}
                  className="group flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/10 transition-all"
                >
                  <div className="flex flex-col items-start">
                    <span className="font-bold text-lg">🚀 Ascending</span>
                    <span className="text-xs text-blue-300">
                      1 to 12 as fast as you can!
                      {timerBestTimes[selectedTable]?.ascending && (
                        <span className="ml-2 text-yellow-400 font-bold">
                          Best: {(timerBestTimes[selectedTable]!.ascending! / 1000).toFixed(1)}s
                        </span>
                      )}
                    </span>
                  </div>
                  <span className="text-2xl group-hover:scale-110 transition-transform">📈</span>
                </button>

                <button
                  onClick={() => startMode('descending')}
                  className="group flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/10 transition-all"
                >
                  <div className="flex flex-col items-start">
                    <span className="font-bold text-lg">🌪️ Descending</span>
                    <span className="text-xs text-blue-300">
                      12 down to 1! 
                      {timerBestTimes[selectedTable]?.descending && (
                        <span className="ml-2 text-yellow-400 font-bold">
                          Best: {(timerBestTimes[selectedTable]!.descending! / 1000).toFixed(1)}s
                        </span>
                      )}
                    </span>
                  </div>
                  <span className="text-2xl group-hover:scale-110 transition-transform">📉</span>
                </button>

                <button
                  onClick={() => startMode('random')}
                  className="group flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/10 transition-all"
                >
                  <div className="flex flex-col items-start">
                    <span className="font-bold text-lg">🎲 Random Mix</span>
                    <span className="text-xs text-blue-300">
                      Surprise order race!
                      {timerBestTimes[selectedTable]?.random && (
                        <span className="ml-2 text-yellow-400 font-bold">
                          Best: {(timerBestTimes[selectedTable]!.random! / 1000).toFixed(1)}s
                        </span>
                      )}
                    </span>
                  </div>
                  <span className="text-2xl group-hover:scale-110 transition-transform">🌀</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedTable(null)}
                className="w-full mt-6 py-3 text-blue-300 font-bold hover:text-white transition-colors"
              >
                Maybe later
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
