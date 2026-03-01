import { motion } from 'framer-motion';

interface DotArrayProps {
  rows: number;
  cols: number;
  highlight?: 'correct' | 'wrong' | null;
}

export default function DotArray({ rows, cols, highlight }: DotArrayProps) {
  const total = rows * cols;
  const dotSize = cols > 8 ? 18 : 22;

  const dotColor =
    highlight === 'correct'
      ? '#4ade80'
      : highlight === 'wrong'
      ? '#f87171'
      : '#93c5fd';

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, ${dotSize}px)`,
          gap: '4px',
        }}
      >
        {Array.from({ length: total }, (_, i) => (
          <motion.div
            key={i}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1, backgroundColor: dotColor }}
            transition={{
              y:              { delay: i * 0.015, duration: 0.2 },
              opacity:        { delay: i * 0.015, duration: 0.2 },
              backgroundColor: { duration: 0.3 },
            }}
            style={{
              width: dotSize,
              height: dotSize,
              borderRadius: '50%',
            }}
          />
        ))}
      </div>
    </div>
  );
}
