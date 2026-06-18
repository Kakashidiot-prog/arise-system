import { useState } from 'react';
import TaskItem from './TaskItem';

interface Task {
  id: number;
  name: string;
  note?: string;
  exp: number;
}

interface QuestCardProps {
  name: string;
  sub: string;
  icon: string;
  tasks: Task[];
  completedTaskIds: number[];
  onToggleTask: (id: number) => void;
}

export default function QuestCard({ name, sub, icon, tasks, completedTaskIds, onToggleTask }: QuestCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Scalable Logic: Calculate progress for THIS specific card
  const doneCount = tasks.filter(t => completedTaskIds.includes(t.id)).length;
  const progressPct = tasks.length > 0 ? (doneCount / tasks.length) * 100 : 0;
  const isAllDone = doneCount === tasks.length && tasks.length > 0;

  return (
    <div className={`quest-card glass-panel mb-3 overflow-hidden transition-all ${
      isAllDone ? 'border-green/30 bg-green/5' : 'border-border hover:border-border2'
    }`}>
      {/* Header */}
      <div 
        className="quest-header flex items-center gap-4 p-4 cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="quest-icon w-9 h-9 bg-bg2 border border-border flex items-center justify-center text-muted text-xs sys-font-mono rounded">
          {icon}
        </div>
        
        <div className="quest-meta flex-1">
          <div className={`quest-name sys-font-title text-sm font-bold tracking-wide ${
            isAllDone ? 'text-green line-through' : 'text-text'
          }`}>
            {name}
          </div>
          <div className="quest-sub text-[11px] text-muted sys-font-mono">{sub}</div>
        </div>

        {/* Status Badge */}
        <span className={`quest-badge text-[9px] px-3 py-1 rounded uppercase sys-font-mono border ${
          isAllDone ? 'bg-green/10 text-green border-green/30' : 'bg-purple/10 text-purple2 border-purple/40'
        }`}>
          {isAllDone ? 'Cleared' : 'Active'}
        </span>
      </div>

      {/* Body (Expandable) */}
      <div className={`quest-body px-4 pb-4 border-t border-border/40 transition-all ${
        isOpen ? 'block' : 'hidden'
      }`}>
        {/* Mini Progress Bar */}
        <div className="mini-bar-track bg-bg2 h-1 rounded overflow-hidden my-3">
          <div 
            className={`mini-bar h-full transition-all duration-500 ${isAllDone ? 'bg-green' : 'bg-purple'}`}
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Tasks List */}
        <div className="tasks-container">
          {tasks.map(task => (
            <TaskItem 
              key={task.id}
              {...task}
              isCompleted={completedTaskIds.includes(task.id)}
              onToggle={onToggleTask}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
