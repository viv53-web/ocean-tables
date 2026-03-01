import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Screen } from './types';
import { useGameStore } from './store/useGameStore';
import SetupScreen from './screens/SetupScreen';
import HomeScreen from './screens/HomeScreen';
import DrillScreen from './screens/DrillScreen';
import TableCompleteScreen from './screens/TableCompleteScreen';
import SettingsScreen from './screens/SettingsScreen';

export default function App() {
  const hasCompletedSetup = useGameStore(s => s.hasCompletedSetup);
  const [screen, setScreen] = useState<Screen>(hasCompletedSetup ? 'home' : 'setup');
  const [activeTable, setActiveTable] = useState<number>(1);
  const [completedTable, setCompletedTable] = useState<number>(1);

  // Sync screen when setup completes (e.g. after completeSetup() is called)
  useEffect(() => {
    if (hasCompletedSetup && screen === 'setup') {
      setScreen('home');
    }
  }, [hasCompletedSetup, screen]);

  const handleStartDrill = (tableN: number) => {
    setActiveTable(tableN);
    setScreen('drill');
  };

  const handleTableComplete = (tableN: number) => {
    setCompletedTable(tableN);
    setScreen('tableComplete');
  };

  const handleBackToHome = () => {
    setScreen('home');
  };

  return (
    <div className="font-nunito min-h-screen">
      <AnimatePresence mode="wait">
        {screen === 'setup' && (
          <motion.div
            key="setup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SetupScreen />
          </motion.div>
        )}

        {screen === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <HomeScreen
              onStartDrill={handleStartDrill}
              onOpenSettings={() => setScreen('settings')}
            />
          </motion.div>
        )}

        {screen === 'drill' && (
          <motion.div
            key="drill"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <DrillScreen
              tableN={activeTable}
              onBack={handleBackToHome}
              onTableComplete={handleTableComplete}
            />
          </motion.div>
        )}

        {screen === 'tableComplete' && (
          <motion.div
            key="tableComplete"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TableCompleteScreen
              tableN={completedTable}
              onBack={handleBackToHome}
            />
          </motion.div>
        )}

        {screen === 'settings' && (
          <motion.div
            key="settings-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <HomeScreen
              onStartDrill={handleStartDrill}
              onOpenSettings={() => {}}
            />
            <SettingsScreen onClose={() => setScreen('home')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
