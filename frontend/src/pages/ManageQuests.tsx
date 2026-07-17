import { useState } from 'react';
import { questsApi } from '../api/axios';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Task {
  id?: number;
  key: string;
  name: string;
  note: string;
  exp: number;
}

interface Quest {
  id: number;
  key: string;
  name: string;
  icon: string;
  sub: string;
  category: string;
  order: number;
  tasks: Task[];
}

export default function ManageQuests() {
  const queryClient = useQueryClient();

  const { data: quests = [], isLoading: loading } = useQuery<Quest[]>({
    queryKey: ['quests'],
    queryFn: questsApi.getAll,
  });
  const [error, setError] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [sub, setSub] = useState('');
  const [category, setCategory] = useState('mind');
  const [order, setOrder] = useState(1);
  const [tasks, setTasks] = useState<{ name: string; note: string; exp: number; targetValue: number }[]>([]);

  // Editing state
  const [editingId, setEditingId] = useState<number | null>(null);

  // Add an empty task row to the form
  const handleAddTaskField = () => {
    setTasks(prev => [...prev, { name: '', note: '', exp: 0.5, targetValue: 1 }]);
  };

  // Remove a specific task row from the form
  const handleRemoveTaskField = (index: number) => {
    setTasks(prev => prev.filter((_, i) => i !== index));
  };

  // Update a specific task row input in React state
  const handleTaskChange = (index: number, field: 'name' | 'note' | 'exp' | 'targetValue', value: string | number) => {
    setTasks(prev =>
      prev.map((task, i) => (i === index ? { ...task, [field]: value } : task))
    );
  };

  const handleResetForm = () => {
    setName('');
    setIcon('');
    setSub('');
    setCategory('mind');
    setOrder(quests.length + 1);
    setTasks([]);
    setEditingId(null);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (tasks.length === 0 && !editingId) {
      setError('A new quest must have at least one task.');
      return;
    }

    try {
      const uniqueKey = `q_${Date.now()}`;
      
      const payload = {
        key: uniqueKey,
        name,
        icon: icon || '⚡',
        sub: sub || `+${tasks.reduce((sum, t) => sum + t.exp, 0)} EXP`,
        category,
        order: Number(order),
        tasks: tasks.map((t, idx) => ({
          key: `t_${uniqueKey}_${idx}`,
          name: t.name,
          note: t.note ? t.note : undefined, // Send undefined instead of null to pass @IsString() validation
          exp: Number(t.exp),
          taskType: (t.targetValue && t.targetValue > 1) ? 'counter' : 'checkbox',
          targetValue: t.targetValue ? Number(t.targetValue) : 1,
        })),
      };

      if (editingId) {
        // UPDATE (CRUD)
        await questsApi.update(editingId, {
          name: payload.name,
          icon: payload.icon,
          sub: payload.sub,
          category: payload.category,
          order: payload.order,
        });
      } else {
        // CREATE (CRUD)
        await questsApi.create(payload);
      }

      handleResetForm();
      queryClient.invalidateQueries({ queryKey: ['quests'] });
    } catch (err: any) {
      console.error("FULL ERROR:", err);
      // If the backend sends a specific 400 Validation Error, show it to the user so we know exactly which field failed!
      const backendMessage = err.response?.data?.message;
      if (backendMessage) {
        setError(`Validation Error: ${Array.isArray(backendMessage) ? backendMessage.join(', ') : backendMessage}`);
      } else {
        setError('Failed to save quest. Check console.');
      }
    }
  };

  const handleEditClick = (quest: Quest) => {
    setEditingId(quest.id);
    setName(quest.name);
    setIcon(quest.icon);
    setSub(quest.sub);
    setCategory(quest.category);
    setOrder(quest.order);
    // When editing, we edit the quest metadata. Task editing is separate.
    setTasks([]);
  };

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Task> }) =>
      questsApi.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quests'] });
    },
  });

  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [taskDraft, setTaskDraft] = useState<{ name: string; note: string; exp: number; }>({ name: '', note: '', exp: 0 });

  const handleTaskEditClick = (task: Task) => {
    setEditingTaskId(task.id!);
    setTaskDraft({ name: task.name, note: task.note, exp: task.exp });
  };

  const handleTaskSave = (taskId: number) => {
    updateTaskMutation.mutateAsync({ id: taskId, data: taskDraft });
    setEditingTaskId(null);
  };

  const handleDeleteClick = async (id: number) => {
    if (!window.confirm('Are you absolutely sure? This will delete the Quest and all of its progress logs!')) {
      return;
    }
    try {
      // DELETE (CRUD)
      await questsApi.delete(id);
      queryClient.invalidateQueries({ queryKey: ['quests'] });
    } catch (err) {
      console.error(err);
      setError('Failed to delete quest');
    }
  };

  return (
    <div className="min-h-screen pb-20 relative z-10 animate-fade-in">
      <div className="max-w-[1000px] mx-auto px-4 pt-10">
        
        {/* Navigation Link */}
        <div className="mb-6">
          <Link to="/dashboard" className="sys-font-mono text-xs md:text-sm tracking-[2px] text-purple2 hover:text-purple3 transition-all uppercase">
            [ ◄ Return to System Dashboard ]
          </Link>
        </div>

        <h1 className="sys-font-title text-3xl md:text-4xl font-bold mb-2 glow-text tracking-wider text-purple3">
          GATE MANAGER
        </h1>
        <p className="sys-font-mono text-xs md:text-sm tracking-[2px] text-muted mb-8 uppercase">
          Create and modify system quests
        </p>

        {error && (
          <div className="p-4 bg-red/10 border border-red text-red rounded mb-6 sys-font-mono text-xs uppercase tracking-wider">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: Quest Creator Form */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-panel p-6 border-purple/20">
              <h2 className="sys-font-mono text-sm md:text-base text-purple2 uppercase tracking-[2px] mb-6">
                {editingId ? '[ Modify Quest ]' : '[ Initialize Quest ]'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="sys-font-mono text-xs tracking-[2px] text-muted uppercase mb-2 block">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full p-3 bg-[#080810] border border-border rounded focus:border-purple focus:outline-none text-text text-sm md:text-base transition-all"
                    placeholder="e.g., LeetCode Daily"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="sys-font-mono text-xs tracking-[2px] text-muted uppercase mb-2 block">Icon</label>
                    <input
                      type="text"
                      value={icon}
                      onChange={e => setIcon(e.target.value)}
                      className="w-full p-3 bg-[#080810] border border-border rounded focus:border-purple focus:outline-none text-text text-sm md:text-base transition-all"
                      placeholder="e.g., ⚡ or React"
                    />
                  </div>
                  <div>
                    <label className="sys-font-mono text-xs tracking-[2px] text-muted uppercase mb-2 block">Order</label>
                    <input
                      type="number"
                      value={order}
                      onChange={e => setOrder(Number(e.target.value))}
                      className="w-full p-3 bg-[#080810] border border-border rounded focus:border-purple focus:outline-none text-text text-sm md:text-base transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="sys-font-mono text-xs tracking-[2px] text-muted uppercase mb-2 block">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full p-3 bg-[#080810] border border-border rounded focus:border-purple focus:outline-none text-text text-sm md:text-base transition-all"
                  >
                    <option value="mind">Intelligence</option>
                    <option value="body">Strength</option>
                    <option value="life">Vitality</option>
                  </select>
                </div>

                <div>
                  <label className="sys-font-mono text-xs tracking-[2px] text-muted uppercase mb-2 block">Subtitle</label>
                  <input
                    type="text"
                    value={sub}
                    onChange={e => setSub(e.target.value)}
                    className="w-full p-3 bg-[#080810] border border-border rounded focus:border-purple focus:outline-none text-text text-sm md:text-base transition-all"
                    placeholder="e.g., +8 EXP"
                  />
                </div>

                {/* DYNAMIC TASK SUB-FORM (Only available on Create) */}
                {!editingId && (
                  <div className="pt-5 border-t border-border/40">
                    <div className="flex justify-between items-center mb-4">
                      <span className="sys-font-mono text-xs text-purple2 uppercase tracking-[1px]">Tasks ({tasks.length})</span>
                      <button
                        type="button"
                        onClick={handleAddTaskField}
                        className="sys-font-mono text-xs bg-purple/20 border border-purple hover:bg-purple text-text px-3 py-1.5 rounded transition-colors uppercase"
                      >
                        + Add Task
                      </button>
                    </div>

                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                      {tasks.map((task, index) => (
                        <div key={index} className="p-4 bg-bg2 border border-border/40 rounded space-y-3 relative">
                          <button
                            type="button"
                            onClick={() => handleRemoveTaskField(index)}
                            className="absolute top-2 right-2 text-muted hover:text-red text-sm"
                          >
                            ×
                          </button>
                          <div>
                            <input
                              type="text"
                              value={task.name}
                              onChange={e => handleTaskChange(index, 'name', e.target.value)}
                              className="w-full p-2 bg-bg border border-border/40 rounded text-sm text-text focus:outline-none focus:border-purple"
                              placeholder="Task name"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <input
                              type="text"
                              value={task.note}
                              onChange={e => handleTaskChange(index, 'note', e.target.value)}
                              className="w-full p-2 bg-bg border border-border/40 rounded text-xs text-text focus:outline-none focus:border-purple"
                              placeholder="Note (optional)"
                            />
                            <input
                              type="number"
                              step="0.25"
                              value={task.exp}
                              onChange={e => handleTaskChange(index, 'exp', Number(e.target.value))}
                              className="w-full p-2 bg-bg border border-border/40 rounded text-xs text-text focus:outline-none focus:border-purple"
                              placeholder="EXP"
                              required
                            />
                            <input
                              type="number"
                              min="1"
                              value={task.targetValue}
                              onChange={e => handleTaskChange(index, 'targetValue', Number(e.target.value))}
                              className="w-full p-2 bg-bg border border-border/40 rounded text-xs text-text focus:outline-none focus:border-purple"
                              placeholder="Goal (e.g. 100)"
                              title="Set higher than 1 for a Progress Bar (Gym Reps)"
                              required
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-purple text-white font-bold sys-font-mono text-sm tracking-[2px] rounded hover:bg-purple2 transition-all uppercase shadow-[0_0_15px_rgba(122,95,255,0.2)]"
                  >
                    {editingId ? 'Save Edits' : 'Register Quest'}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="py-3 px-4 bg-bg2 border border-border text-muted hover:text-text rounded sys-font-mono text-sm transition-all uppercase"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* RIGHT: Active Quests List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="glass-panel p-6 border-purple/20">
              <h2 className="sys-font-mono text-sm md:text-base text-purple2 uppercase tracking-[2px] mb-6">
                [ Active Gate Registry ]
              </h2>

              {loading ? (
                <div className="text-center sys-font-mono text-muted py-10 text-sm uppercase tracking-widest animate-pulse">
                  Analyzing gate matrix...
                </div>
              ) : quests.length === 0 ? (
                <div className="text-center sys-font-mono text-muted py-10 text-sm uppercase">
                  No active gates detected.
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {quests.map(quest => (
                    <div key={quest.id} className="p-4 bg-bg2 border border-border/40 rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-purple/30 transition-all">
                      <div>
                        <div className="flex items-center gap-3 mb-1.5">
                          <span className="text-xl">{quest.icon}</span>
                          <h3 className="font-bold text-text text-base md:text-lg sys-font-title tracking-wide">{quest.name}</h3>
                          <span className="sys-font-mono text-[10px] tracking-[1px] bg-purple/20 border border-purple/40 text-purple2 px-2.5 py-0.5 rounded uppercase">
                            {quest.category}
                          </span>
                        </div>
                        <p className="sys-font-mono text-xs text-muted uppercase tracking-[1px]">
                          {quest.sub} · {quest.tasks.length} tasks
                        </p>
                        <div className="mt-3 space-y-2">
                          {quest.tasks.map(task => (
    <div key={task.id} className="flex items-center gap-2 bg-bg/40 p-2 rounded border border-border/20">
      {editingTaskId === task.id ? (
        <>
          <input
            type="text"
            value={taskDraft.name}
            onChange={e => setTaskDraft(prev => ({ ...prev, name: e.target.value }))}
            className="flex-1 p-1 bg-bg border border-border/40 rounded text-xs text-text"
          />
          <input
            type="number"
            step="0.25"
            value={taskDraft.exp}
            onChange={e => setTaskDraft(prev => ({ ...prev, exp: Number(e.target.value) }))}
            className="w-16 p-1 bg-bg border border-border/40 rounded text-xs text-text"
          />
          <button
            onClick={() => handleTaskSave(task.id!)}
            className="text-xs text-green px-2 py-1 border border-green/40 rounded uppercase"
          >
            Save
          </button>
          <button
            onClick={() => setEditingTaskId(null)}
            className="text-xs text-muted px-2 py-1 border border-border rounded uppercase"
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <span className="flex-1 text-xs text-text/80">{task.name}</span>
          <span className="text-xs text-gold">{task.exp} EXP</span>
          <button
            onClick={() => handleTaskEditClick(task)}
            className="text-xs text-muted hover:text-purple2 px-2 py-1 border border-border rounded uppercase"
          >
            Edit
          </button>
        </>
      )}
    </div>
  ))}
</div>  
                      </div>

                      <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                        <button
                          onClick={() => handleEditClick(quest)}
                          className="sys-font-mono text-xs tracking-[1px] text-muted hover:text-purple2 border border-border hover:border-purple px-4 py-2 rounded transition-all uppercase"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(quest.id)}
                          className="sys-font-mono text-xs tracking-[1px] text-muted hover:text-red border border-border hover:border-red px-4 py-2 rounded transition-all uppercase"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
