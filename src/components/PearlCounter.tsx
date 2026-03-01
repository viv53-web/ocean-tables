import { useGameStore } from '../store/useGameStore';

export default function PearlCounter() {
  const pearls = useGameStore(s => s.pearls);
  const streak = useGameStore(s => s.streak);

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur rounded-full px-3 py-1.5">
        <span className="text-lg">🦪</span>
        <span className="font-bold text-white">{pearls}</span>
      </div>
      {streak > 0 && (
        <div className="flex items-center gap-1 bg-orange-500/80 rounded-full px-3 py-1.5">
          <span className="text-lg">🔥</span>
          <span className="font-bold text-white text-sm">{streak}</span>
        </div>
      )}
    </div>
  );
}
