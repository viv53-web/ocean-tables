import { useMemo } from 'react';

interface Bubble {
  id: number;
  size: number;
  left: number;
  duration: number;
  delay: number;
  bottom: number;
}

export default function BubbleBackground() {
  const bubbles = useMemo<Bubble[]>(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      size: Math.random() * 30 + 10,
      left: Math.random() * 100,
      duration: Math.random() * 12 + 8,
      delay: Math.random() * 10,
      bottom: Math.random() * 20,
    }));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {bubbles.map(b => (
        <div
          key={b.id}
          className="bubble"
          style={{
            width: b.size,
            height: b.size,
            left: `${b.left}%`,
            bottom: `${b.bottom}%`,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
