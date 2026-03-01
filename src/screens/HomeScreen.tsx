import { motion } from 'framer-motion';
import BubbleBackground from '../components/BubbleBackground';
import SeaCreature from '../components/SeaCreature';
import PearlCounter from '../components/PearlCounter';
import { useGameStore } from '../store/useGameStore';
import { getMasteryForTable } from '../engine/sm2';

interface HomeScreenProps {
  onStartDrill: (tableN: number) => void;
  onOpenSettings: () => void;
}

export default function HomeScreen({ onStartDrill, onOpenSettings }: HomeScreenProps) {
  const facts = useGameStore(s => s.facts);
  const masteredTables = useGameStore(s => s.masteredTables);

  const handleCreatureClick = (tableN: number) => {
    onStartDrill(tableN);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <BubbleBackground />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-4 pb-2">
        <button
          onClick={onOpenSettings}
          className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-xl transition-colors"
          title="Settings"
        >
          ⚙️
        </button>
        <h1 className="text-xl font-black">Ocean Tables 🌊</h1>
        <PearlCounter />
      </div>

      {/* Ocean scene */}
      <div className="relative z-10 flex flex-col min-h-[calc(100vh-5rem)]">
        {/* Water */}
        <div className="flex-1 flex flex-col justify-end pb-4">
          <p className="text-center text-blue-200 text-sm mb-4 px-4">
            Tap a creature to practise that times table!
          </p>

          {/* Creatures grid */}
          <div className="px-4 mb-4">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 max-w-2xl mx-auto">
              {Array.from({ length: 12 }, (_, i) => i + 1).map(tableN => {
                const isMastered = masteredTables.includes(tableN);
                const mastery = isMastered ? 1 : getMasteryForTable(facts, tableN);
                return (
                  <motion.div
                    key={tableN}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: tableN * 0.04 }}
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

        {/* Seabed */}
        <div
          className="relative z-10 h-16"
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
    </div>
  );
}
