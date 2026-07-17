interface TaskItemProps {
  id: number;
  name: string;
  note?: string;
  exp: number;
  targetValue?: number;
  currentValue?: number;
  isCompleted: boolean;
  onToggle: (id: number) => void;
  onIncrement?: (id: number, amount: number) => void;
}

export default function TaskItem({ id, name, note, exp, targetValue, currentValue = 0, isCompleted, onToggle, onIncrement }: TaskItemProps) {
  const isCounter = targetValue && targetValue > 1;
  const progressPct = isCounter ? Math.min((currentValue / targetValue!) * 100, 100) : 0;

  return (
    <div className="task-row flex flex-col py-3 border-b border-border/40 last:border-none group">
      <div className="flex items-start gap-3 w-full">
        {/* Checkbox (Only for Normal Tasks) */}
        {!isCounter && (
          <div 
            onClick={() => onToggle(id)}
            className={`task-check mt-0.5 w-5 h-5 border border-purple/40 rounded flex items-center justify-center cursor-pointer transition-all hover:border-purple ${
              isCompleted ? 'bg-purple border-purple text-white' : 'bg-bg text-transparent'
            }`}
          >
            {isCompleted ? '✓' : ''}
          </div>
        )}

        {/* Info */}
        <div className="task-info flex-1">
          <div className="flex justify-between items-center w-full">
            <div className={`task-name text-sm transition-all ${
              isCompleted ? 'text-green line-through opacity-50' : 'text-text'
            }`}>
              {name}
            </div>
            
            {/* Show Progress Text for Counters */}
            {isCounter && (
              <div className={`sys-font-mono text-[10px] tracking-wide ${isCompleted ? 'text-green' : 'text-purple2'}`}>
                {currentValue} / {targetValue}
              </div>
            )}
            
            {/* Show EXP for Normal Tasks */}
            {!isCounter && (
              <div className="task-exp text-[10px] text-gold sys-font-mono mt-1">+{exp} EXP</div>
            )}
          </div>
          
          {note && <div className="task-note text-[10px] text-muted sys-font-mono mt-1">{note}</div>}
          
          {/* Progress Bar & Button (Only for Counter Tasks) */}
          {isCounter && (
            <div className="mt-3 flex items-center gap-3">
              <div className="flex-1 h-2 bg-bg2 rounded overflow-hidden border border-border/50">
                <div 
                  className={`h-full transition-all duration-500 ${isCompleted ? 'bg-green glow-green' : 'bg-purple glow-purple'}`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <button
                onClick={() => onIncrement && onIncrement(id, 1)}
                disabled={isCompleted}
                className={`sys-font-mono text-[10px] px-3 py-1 rounded border transition-all uppercase ${
                  isCompleted 
                    ? 'border-green/30 text-green/50 bg-green/5 cursor-not-allowed' 
                    : 'border-purple/50 text-purple2 bg-purple/10 hover:bg-purple hover:text-white hover:border-purple'
                }`}
              >
                {isCompleted ? 'Done' : '+1'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
