import { motion, AnimatePresence } from 'framer-motion';
import { getMnemonic } from '../utils/mnemonics';

interface MnemonicOverlayProps {
  tableN: number;
  multiplier: number;
  onClose: () => void;
}

export default function MnemonicOverlay({ tableN, multiplier, onClose }: MnemonicOverlayProps) {
  const text = getMnemonic(tableN, multiplier);

  const getIcon = (n: number) => {
    const icons: Record<number, string> = {
      1: '⭐', 2: '🪼', 3: '🦀', 4: '🐠', 5: '🐬', 6: '🐙', 
      7: '🦈', 8: '🐋', 9: '🐢', 10: '🐟', 11: '🐡', 12: '🦄'
    };
    return icons[n] || '🐚';
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative bg-gradient-to-br from-ocean-mid to-ocean-deep rounded-[2rem] p-8 max-w-sm mx-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20"
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 20 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Main Icon */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-xl w-20 h-20 rounded-full flex items-center justify-center text-5xl shadow-xl border border-white/20">
            {getIcon(tableN)}
          </div>

          <div className="mt-8 text-center">
            <h3 className="font-black text-3xl mb-4 text-yellow-300 drop-shadow">
              {tableN} × {multiplier} = {tableN * multiplier}
            </h3>
            <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
              <p className="text-white text-lg font-medium leading-relaxed italic">
                "{text}"
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="mt-6 w-full py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-white font-black text-xl shadow-lg transition-all active:scale-95"
          >
            I've got it! 🤿
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
