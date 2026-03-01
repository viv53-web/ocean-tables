import { motion, AnimatePresence } from 'framer-motion';
import { getMnemonic } from '../utils/mnemonics';

interface MnemonicOverlayProps {
  tableN: number;
  multiplier: number;
  onClose: () => void;
}

export default function MnemonicOverlay({ tableN, multiplier, onClose }: MnemonicOverlayProps) {
  const text = getMnemonic(tableN, multiplier);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative bg-ocean-mid rounded-3xl p-6 max-w-sm mx-4 shadow-2xl border border-white/20"
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 20 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Octopus */}
          <div className="absolute -top-8 -right-4 text-6xl">🐙</div>

          {/* Speech bubble tail */}
          <div className="absolute -top-3 right-12 w-6 h-6 bg-ocean-mid rotate-45 border-t border-l border-white/20" />

          <h3 className="font-bold text-lg mb-3 text-yellow-300">
            {tableN} × {multiplier} = {tableN * multiplier}
          </h3>
          <p className="text-white/90 leading-relaxed text-sm">{text}</p>

          <button
            onClick={onClose}
            className="mt-4 w-full py-2 rounded-xl bg-white/20 hover:bg-white/30 font-semibold transition-colors"
          >
            Got it! 👍
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
