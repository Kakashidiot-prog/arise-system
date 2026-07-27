import { useState } from 'react';
import TaskItem from './TaskItem';

interface Task {
  id: number;
  name: string;
  note?: string;
  exp: number;
  targetValue?: number;
}

interface QuestCardProps {
  name: string;
  sub: string;
  isDaily?: boolean;
  tasks: Task[];
  completedTaskIds: number[];
  progressMap?: Record<number, number>; // maps taskId to currentValue
  onToggleTask: (id: number) => void;
  onIncrementTask?: (id: number, amount: number) => void;
}

export default function QuestCard({ name, sub, isDaily, tasks, completedTaskIds, progressMap = {}, onToggleTask, onIncrementTask }: QuestCardProps) {
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
        <div className="quest-meta flex-1">
          <div className={`quest-name sys-font-title text-sm font-bold tracking-wide ${
            isAllDone ? 'text-green line-through' : 'text-text'
          }`}>
            {name}
          </div>
          <div className="quest-sub text-[11px] text-muted sys-font-mono">{sub}</div>
        </div>

        {/* Status Badge */}
         <div className="flex items-center gap-2">
              {isDaily && (
                <span className="quest-badge text-[9px] px-2 py-0.5 rounded bg-blue/10 text-blue border border-blue/30 sys-font-mono uppercase">
                  Daily
                </span>
              )}
              <span className={`quest-badge text-[9px] px-3 py-1 rounded uppercase sys-font-mono border ${
                isAllDone ? 'bg-green/10 text-green border-green/30' : 'bg-purple/10 text-purple2 border-purple/40'
              }`}>
                {isAllDone ? (isDaily ? 'Completed Today' : 'Cleared') : 'Active'}
              </span>
            </div> 
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
              id={task.id}
              name={task.name}
              note={task.note}
              exp={task.exp}
              targetValue={task.targetValue}
              currentValue={progressMap[task.id] || 0}
              isCompleted={completedTaskIds.includes(task.id)}
              onToggle={onToggleTask}
              onIncrement={onIncrementTask}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
