interface TaskItemProps {
  id: number;
  name: string;
  note?: string;
  exp: number;
  isCompleted: boolean;
  onToggle: (id: number) => void;
}

export default function TaskItem({ id, name, note, exp, isCompleted, onToggle }: TaskItemProps) {
  return (
    <div className="task-row flex items-start gap-3 py-2 border-b border-border/40 last:border-none group">
      {/* Checkbox */}
      <div 
        onClick={() => onToggle(id)}
        className={`task-check w-5 h-5 border border-purple/40 rounded flex items-center justify-center cursor-pointer transition-all hover:border-purple ${
          isCompleted ? 'bg-purple border-purple text-white' : 'bg-bg text-transparent'
        }`}
      >
        {isCompleted ? '✓' : ''}
      </div>

      {/* Info */}
      <div className="task-info flex-1">
        <div className={`task-name text-sm transition-all ${
          isCompleted ? 'text-green line-through opacity-50' : 'text-text'
        }`}>
          {name}
        </div>
        {note && <div className="task-note text-[10px] text-muted sys-font-mono mt-1">{note}</div>}
      </div>

      {/* EXP Reward */}
      <div className="task-exp text-[10px] text-gold sys-font-mono mt-1">+{exp} EXP</div>
    </div>
  );
}
