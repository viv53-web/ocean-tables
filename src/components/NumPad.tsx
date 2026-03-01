interface NumPadProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
}

export default function NumPad({ value, onChange, onSubmit }: NumPadProps) {
  const handleDigit = (d: string) => {
    if (value.length < 3) onChange(value + d);
  };

  const handleBackspace = () => {
    onChange(value.slice(0, -1));
  };

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', '✓'];

  return (
    <div className="md:hidden grid grid-cols-3 gap-2 mt-4 w-full max-w-xs mx-auto">
      {keys.map(k => {
        const isBackspace = k === '⌫';
        const isSubmit = k === '✓';
        return (
          <button
            key={k}
            onClick={() => {
              if (isBackspace) handleBackspace();
              else if (isSubmit) onSubmit();
              else handleDigit(k);
            }}
            className={`
              h-14 rounded-xl text-2xl font-bold transition-all active:scale-95
              ${isSubmit
                ? 'bg-green-500 text-white shadow-lg shadow-green-900/40'
                : isBackspace
                ? 'bg-blue-700/60 text-white'
                : 'bg-blue-800/70 text-white hover:bg-blue-700/80'
              }
            `}
          >
            {k}
          </button>
        );
      })}
    </div>
  );
}
