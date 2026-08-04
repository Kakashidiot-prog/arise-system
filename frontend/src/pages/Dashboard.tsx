import { useEffect } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { removeToken, progressApi, questsApi, logsApi } from '../api/axios';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import SystemHeader from '../components/SystemHeader';
import StatCard from '../components/StatCard';
import ExpBar from '../components/ExpBar';
import QuestCard from '../components/QuestCard';



const SOLO_LEVELING_QUOTES = [
  { text: "Consistency is about showing up every day, not burning yourself out in one day.", speaker: "The System" },
  { text: "The System uses me, and I use the system.", speaker: "Sung Jinwoo" },
  { text: "I am the record of your struggle. I am the shadow of your growth.", speaker: "The System" },
  { text: "Focus on small improvement each day, instead of trying to do everything at once.", speaker: "Kaizen" },
  { text: "Embrace imperfection. Taking action is better than waiting for perfection.", speaker: "Wabi-Sabi" },
  { text: "Accept things as they are and move forward.", speaker: "Shikata Ga Nai" },
  { text: "I will keep leveling up until I reach the top.", speaker: "Sung Jinwoo" },
  { text: "I'm always leveling up ceaselessly.", speaker: "Sung Jinwoo" },
  { text: "The day I stop working is the day I truly die.", speaker: "Sung Jinwoo" },
  { text: "We are what we choose to become.", speaker: "Sung Jinwoo" },
  { text: "Our greatest glory lies not in never falling, but in rising every time we fall.", speaker: "Sung Jinwoo" },
  { text: "Strength is born from adversity.", speaker: "Sung Jinwoo" },
  { text: "New challenges lead to new strengths.", speaker: "Sung Jinwoo" },
  { text: "Arise.", speaker: "Jinwoo" },
  { text: "The weak are meat, the strong eat.", speaker: "Sung Jinwoo" },
  { text: "I'm still learning.", speaker: "Sung Jinwoo" },
  { text: "Courage isn't the absence of fear.", speaker: "Sung Jinwoo" },
  { text: "I certainly got much stronger than before.", speaker: "Sung Jinwoo" },
];

function getDailyQuote() {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const diff = Date.now() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return SOLO_LEVELING_QUOTES[dayOfYear % SOLO_LEVELING_QUOTES.length];
}

function getRank(level: number): string {
  if (level >= 35) return 'S-Rank · Shadow Monarch';
  if (level >= 28) return 'S-Rank Hunter';
  if (level >= 22) return 'A-Rank Hunter';
  if (level >= 16) return 'B-Rank Hunter';
  if (level >= 10) return 'C-Rank Hunter';
  if (level >= 5) return 'D-Rank Hunter';
  return 'E-Rank Hunter';
}

function getLast7Days() {
  const result = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const monthDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    result.push({ dateStr, dayName, monthDay });
  }
  return result;
}

interface Quest {
  id: number;
  key: string;
  name: string;
  icon: string;
  sub: string;
  category: string;
  isDaily?: boolean;
  tasks: { id: number; key: string; name: string; note: string; exp: number; targetValue?: number }[];
}

interface Stats {
  exp: number;
  level: number;
  streak: number;
  username: string;
  hasSeenWelcome: boolean;
}

interface ProgressRecord {
  taskId: number;
  completed: boolean;
  currentValue: number;
}

export default function Dashboard() {
  // 1. STATE
  const [activeTab, setActiveTab] = useState<'mind' | 'body' | 'life' | 'report'>('mind');
  const [showLevelUp, setShowLevelUp] = useState<number | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [goalInput, setGoalInput] = useState('');

  const [showResetNotification, setShowResetNotification] = useState(false);
  const [focusedDailyQuest, setFocusedDailyQuest] = useState<Quest | null>(null);

  useEffect(() => {
    if (focusedDailyQuest || showGenerateModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [focusedDailyQuest, showGenerateModal]);

  // 2. SETUP & QUERIES
  const quote = getDailyQuote();
  const queryClient = useQueryClient();

  const { data: stats, isLoading: statsLoading } = useQuery<Stats>({
    queryKey: ['stats'],
    queryFn: progressApi.getStats,
  });

  const { data: questsData, isLoading: questsLoading } = useQuery<{resetOccurred: boolean, quests: Quest[]}>({
    queryKey: ['quests'],
    queryFn: questsApi.getAll,
  });

  const quests = questsData?.quests || [];

  const { data: progressData = [] } = useQuery<ProgressRecord[]>({
    queryKey: ['progress'],
    queryFn: progressApi.getUserProgress,
  });

  const { data: logs = [] } = useQuery<{ id: number; text: string; createdAt: string }[]>({
    queryKey: ['logs'],
    queryFn: logsApi.getAll,
  });

  const { data: weekActivity = {} } = useQuery<Record<string, boolean>>({
    queryKey: ['weekActivity'],
    queryFn: progressApi.getWeekActivity,
  });

  // 3. EFFECTS
  useEffect(() => {
    // If the database says they haven't seen it, show it!
    if (stats && stats.hasSeenWelcome === false) {
      setShowWelcome(true);
    }
  }, [stats]);

  useEffect(() => {
    if (questsData?.resetOccurred) {
      setShowResetNotification(true);
    }
  }, [questsData?.resetOccurred]);

  // 4. MUTATIONS & HANDLERS
  const acceptWelcomeMutation = useMutation({
    mutationFn: progressApi.acceptWelcome,
    onSuccess: () => {
      // Tell React Query to refresh the stats from the database
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      setShowWelcome(false);
    }
  });

  const handleAcceptWelcome = async () => {
    acceptWelcomeMutation.mutate();
  };

  const completedTasks = progressData.filter(p => p.completed).map((p) => p.taskId);
  
  // Build a progress map for the counter tasks
  const progressMap = progressData.reduce((acc, p) => {
    acc[p.taskId] = p.currentValue;
    return acc;
  }, {} as Record<number, number>);

   // --- STAT DISTRIBUTION LOGIC ---
      const statTotals = { mind: 0, body: 0, life: 0 };

   quests.forEach(quest => {
        quest.tasks.forEach(task => {
          // If the user completed this task, add its EXP to the quest's category
          if (completedTasks.includes(task.id)) {
            if (quest.category === 'mind') statTotals.mind += task.exp;
            if (quest.category === 'body') statTotals.body += task.exp;
            if (quest.category === 'life') statTotals.life += task.exp;
          }
        });
      });
      
   const radarData = [
        { subject: 'Intelligence', amount: statTotals.mind, fullMark: Math.max(10, statTotals.mind + 5) },
        { subject: 'Strength', amount: statTotals.body, fullMark: Math.max(10, statTotals.body + 5) },
        { subject: 'Vitality', amount: statTotals.life, fullMark: Math.max(10, statTotals.life + 5) },
      ];


const toggleMutation = useMutation({
  mutationFn: (taskId: number) => progressApi.toggle(taskId),
  onMutate: async (taskId: number) => {
    await queryClient.cancelQueries({ queryKey: ['progress'] });
    const previousProgress = queryClient.getQueryData<ProgressRecord[]>(['progress']);

    queryClient.setQueryData<ProgressRecord[]>(['progress'], (old = []) => {
      const exists = old.find(p => p.taskId === taskId);
      if (exists) {
        return old.map(p => p.taskId === taskId ? { ...p, completed: !p.completed } : p);
      }
      return [...old, { taskId, completed: true, currentValue: 0 }];
    });

    return { previousProgress };
  },
  onError: (_err, _taskId, context) => {
    if (context?.previousProgress) {
      queryClient.setQueryData(['progress'], context.previousProgress);
    }
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['stats'] });
    queryClient.invalidateQueries({ queryKey: ['progress'] });
    queryClient.invalidateQueries({ queryKey: ['logs'] });
    queryClient.invalidateQueries({ queryKey: ['weekActivity'] });
  },
});
  
  const handleToggle = async (taskId: number) => {
  const prevLevel = stats?.level;
  await toggleMutation.mutateAsync(taskId);
  const newStats = queryClient.getQueryData<Stats>(['stats']);
  if (prevLevel !== undefined && newStats && newStats.level > prevLevel) {
    setShowLevelUp(newStats.level);
  }
};

const incrementMutation = useMutation({
  mutationFn: ({ taskId, amount }: { taskId: number; amount: number }) => progressApi.increment(taskId, amount),
  onMutate: async ({ taskId, amount }) => {
    await queryClient.cancelQueries({ queryKey: ['progress'] });
    const previousProgress = queryClient.getQueryData<ProgressRecord[]>(['progress']);

    queryClient.setQueryData<ProgressRecord[]>(['progress'], (old = []) => {
      const exists = old.find(p => p.taskId === taskId);
      if (exists) {
        return old.map(p => p.taskId === taskId ? { ...p, currentValue: p.currentValue + amount } : p);
      }
      return [...old, { taskId, completed: false, currentValue: amount }];
    });

    return { previousProgress };
  },
  onError: (_err, _vars, context) => {
    if (context?.previousProgress) {
      queryClient.setQueryData(['progress'], context.previousProgress);
    }
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['stats'] });
    // Intentionally NOT invalidating 'progress' here to prevent UI bouncing on rapid clicks.
    // The optimistic update handles the UI state accurately.
    queryClient.invalidateQueries({ queryKey: ['logs'] });
    queryClient.invalidateQueries({ queryKey: ['weekActivity'] });
  },
});
  
  
  const handleIncrement = async (taskId: number, amount: number) => {
    const prevLevel = stats?.level;
    await incrementMutation.mutateAsync({ taskId, amount });
    const newStats = queryClient.getQueryData<Stats>(['stats']);
    if (prevLevel !== undefined && newStats && newStats.level > prevLevel) {
      setShowLevelUp(newStats.level);
    }
  };

  const handleLogout = () => {
    removeToken();
    window.location.href = '/login';
  };

  const generateMutation = useMutation({
  mutationFn: (goal: string) => questsApi.generate(goal),
  onSuccess: (newQuest) => {
    queryClient.invalidateQueries({ queryKey: ['quests'] });
    setShowGenerateModal(false);
    setGoalInput('');
    if (newQuest?.category) {
      setActiveTab(newQuest.category);
    }
  },
});

const handleGenerate = () => {
  if (goalInput.trim()) {
    generateMutation.mutate(goalInput);
  }
};

  if (statsLoading || questsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="sys-font-mono text-purple2 text-sm tracking-[3px] uppercase animate-pulse">
          [ Loading System... ]
        </div>
      </div>
    );
}

  return (
    <>
    <div className="min-h-screen pb-20 relative z-10 animate-fade-in">
      <div className="max-w-[900px] mx-auto px-4">
        {stats && (
          <SystemHeader
            name={stats.username}
            rank={getRank(stats.level)}
            level={stats.level}
          />
        )}

        <div className="flex justify-between items-center mb-4">
          <Link
            to="/manage-quests"
            className="sys-font-mono text-[10px] tracking-[2px] text-purple2 hover:text-purple3 transition-colors uppercase"
          >
            [ Manage Gates ]
          </Link>
          <button
            onClick={handleLogout}
            className="sys-font-mono text-[10px] tracking-[2px] text-muted hover:text-red transition-colors uppercase"
          >
            [ Terminate Session ]
          </button>
        </div>

        {stats && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <StatCard label="Level" value={stats.level} />
              <StatCard label="Total EXP" value={stats.exp.toFixed(1)} colorClass="text-gold" />
              <StatCard label="Quests Done" value={`${completedTasks.length}/${quests.reduce((acc, q) => acc + q.tasks.length, 0)}`} colorClass="text-green" />
              <StatCard label="Day Streak" value={stats.streak} colorClass="text-blue" />
            </div>
            <ExpBar currentExp={stats.exp % 5} maxExp={5} />
          </>
        )}

        <div className="glass-panel p-4 mb-4 border-purple/20">
          <p className="sys-font-body text-lg italic text-text/80 tracking-wide leading-relaxed">
            "{quote.text}"
          </p>
          <p className="sys-font-mono text-[11px] text-purple2 mt-4 uppercase tracking-[2px]">
            — {quote.speaker}
          </p>
        </div>
        <button
            onClick={() => setShowGenerateModal(true)}
            className="w-full mb-6 py-2 bg-purple/10 border border-purple/40 text-purple2 sys-font-mono text-xs tracking-[2px] rounded hover:bg-purple/20 transition-all uppercase"
          >
            [ + Generate Quest ]
          </button>

        {/* --- SYSTEM DAILY QUEST (THE CONSTRAINT) --- */}
        {(() => {
          const dailyQuests = quests.filter((q) => q.isDaily);
          let dailyTotal = 0;
          let dailyCompleted = 0;
          dailyQuests.forEach(q => {
            q.tasks.forEach(t => {
              dailyTotal++;
              if (completedTasks.includes(t.id!)) {
                dailyCompleted++;
              }
            });
          });
          
          return (
            <div className="mb-8">
              <div className="flex flex-col items-center gap-2 mb-4">
                <div className="flex items-center gap-3 w-full">
                  <div className="h-[2px] flex-1 bg-red/30"></div>
                  <h2 className="sys-font-mono text-[13px] text-red animate-pulse tracking-[4px] uppercase font-bold drop-shadow-[0_0_8px_rgba(255,0,0,0.8)] text-center">
                    [ SYSTEM DEMAND: DAILY QUESTS ]
                  </h2>
                  <div className="h-[2px] flex-1 bg-red/30"></div>
                </div>
                {dailyTotal > 0 && (
                  <div className="sys-font-mono text-[11px] tracking-[2px] text-red/80 uppercase">
                    [ {dailyCompleted} / {dailyTotal} COMPLETED TODAY ]
                  </div>
                )}
              </div>
          <div className="space-y-3">
            {quests.filter((q) => q.isDaily).length === 0 ? (
              <p className="sys-font-mono text-center text-xs text-muted italic p-4 border border-red/20 bg-red/5 rounded shadow-[0_0_15px_rgba(255,0,0,0.1)]">
                No daily requirements detected. Rest for now, Hunter.
              </p>
            ) : (
              quests
                .filter((q) => q.isDaily)
                .map((quest) => (
                  <button 
                    key={`daily-wrapper-${quest.id}`} 
                    className="w-full text-left ring-1 ring-red/30 rounded p-5 bg-bg2/80 flex items-center justify-between hover:bg-red/5 transition-all shadow-[0_0_15px_rgba(255,0,0,0.15)] hover:shadow-[0_0_20px_rgba(255,0,0,0.3)] group relative overflow-hidden"
                    onClick={() => setFocusedDailyQuest(quest)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red/10 to-transparent pointer-events-none w-1/3"></div>
                    <div className="relative z-10">
                      <h3 className="sys-font-title font-bold text-red text-xl uppercase tracking-wider group-hover:drop-shadow-[0_0_8px_rgba(255,0,0,0.8)] transition-all">
                        {quest.name}
                      </h3>
                      <p className="sys-font-mono text-xs text-muted/80 tracking-[2px] uppercase mt-1">
                        [ {quest.tasks.length} Requirements Pending ]
                      </p>
                    </div>
                    <div className="sys-font-mono text-red text-xs uppercase animate-pulse border border-red/30 px-3 py-1 rounded bg-bg relative z-10">
                      [ VIEW DETAILS ]
                    </div>
                  </button>
                ))
            )}
            </div>
          </div>
        );
        })()}
        {/* ------------------------------------------ */}

        <div className="flex gap-[2px] mb-6 bg-panel border border-border rounded-lg p-1">
          
          {(['mind', 'body', 'life', 'report'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded sys-font-mono text-[10px] tracking-[2px] uppercase transition-all ${
                activeTab === tab
                  ? 'bg-bg2 text-purple2 border border-border2'
                  : 'text-muted hover:text-purple2'
              }`}
            >
              {tab === 'mind' ? 'Intelligence' : tab === 'body' ? 'Strength' : tab === 'life' ? 'Vitality' : 'Report'}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {activeTab !== 'report' && quests
            .filter((q) => q.category === activeTab && !q.isDaily)
            .map((quest) => (
              <QuestCard
                key={quest.id}
                name={quest.name}
                sub={quest.sub}
                isDaily={quest.isDaily}
                tasks={quest.tasks}
                completedTaskIds={completedTasks}
                progressMap={progressMap}
                onToggleTask={handleToggle}
                onIncrementTask={handleIncrement}
              />
            ))}

          {activeTab === 'report' && (
            <div className="space-y-6">
              {/* --- NEW STATUS RADAR CHART --- */}
              <div className="glass-panel p-6 border-purple/20">
                <h3 className="sys-font-mono text-[12px] text-purple2 uppercase tracking-[2px] mb-4">
                  [ Stat Distribution ]
                </h3>
                <div className="h-[250px] w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                      <PolarGrid stroke="rgba(122,95,255,0.2)" />
                      <PolarAngleAxis 
                        dataKey="subject" 
                        tick={{ fill: '#8075FF', fontSize: 10, fontFamily: 'monospace', textAnchor: 'middle' }} 
                      />
                      <PolarRadiusAxis 
                        angle={30} 
                        domain={[0, 'dataMax']} 
                        tick={false} 
                        axisLine={false} 
                      />
                      <Radar
                        name="Player Stats"
                        dataKey="amount"
                        stroke="#7A5FFF"
                        strokeWidth={2}
                        fill="#7A5FFF"
                        fillOpacity={0.4}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              {/* ------------------------------ */}

              <div className="glass-panel p-6 border-purple/20">
                <h3 className="sys-font-mono text-[12px] text-purple2 uppercase tracking-[2px] mb-4">
                  [ Weekly Consistency Tracker ]
                </h3>
                <div className="grid grid-cols-7 gap-2">
                  {getLast7Days().map((day) => {
                    const isActive = weekActivity[day.dateStr];
                    return (
                      <div key={day.dateStr} className="text-center">
                        <span className="sys-font-mono text-[10px] text-muted block mb-2">
                          <span className="block text-purple2">{day.dayName}</span>
                          <span className="text-[8px] opacity-70 tracking-tighter">{day.monthDay}</span>
                        </span>
                        <div
                          className={`h-12 w-full rounded border flex items-center justify-center transition-all ${
                            isActive
                              ? 'bg-green2/20 border-green text-green glow-green'
                              : 'bg-bg2 border-border/40 text-muted2'
                          }`}
                          title={day.dateStr}
                        >
                          {isActive ? '✓' : '•'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="glass-panel p-6 border-purple/20">
                <h3 className="sys-font-mono text-[12px] text-purple2 uppercase tracking-[2px] mb-4">
                  [ SYSTEM EVENT ARCHIVE ]
                </h3>
                <div className="max-h-[300px] overflow-y-auto space-y-2 bg-bg/50 border border-border/40 p-4 rounded font-mono text-[11px] leading-relaxed">
                  {logs.length === 0 ? (
                    <p className="text-muted italic">[ No system records registered yet ]</p>
                  ) : (
                    logs.map((log) => {
                      const logDate = new Date(log.createdAt);
                      const isToday = new Date().toDateString() === logDate.toDateString();
                      const dateDisplay = isToday 
                        ? logDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : logDate.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

                      return (
                        <div key={log.id} className="text-text/80 hover:text-text transition-colors border-b border-border/20 pb-2 mb-2 last:border-0 last:pb-0 last:mb-0">
                          <span className="text-muted select-none whitespace-nowrap">
                            [{dateDisplay}]
                          </span>{' '}
                          <span className={log.text.startsWith('Completed') ? 'text-green' : 'text-purple2'}>
                            {log.text}
                          </span>
                        </div>
                      );
                    })
                  )}  
                </div>
              </div>
            </div>
          )}
        </div>

        <footer className="mt-20 text-center sys-font-mono text-[10px] text-muted2 tracking-[2px] uppercase pb-10">
          [ ARISE · aria system · v1.0 ]
        </footer>
      </div>
    </div>

      {/* --- DAILY QUEST FOCUS MODAL --- */}
      {focusedDailyQuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/95 backdrop-blur-md p-4 animate-fade-in overflow-y-auto"
          onClick={() => setFocusedDailyQuest(null)}
        >
          <div
            className="max-w-2xl w-full relative my-auto"
            onClick={(e) => e.stopPropagation()}
            >
            <button
              onClick={() => setFocusedDailyQuest(null)}
              className="absolute -top-12 right-0 text-muted hover:text-red transition-colors sys-font-mono text-xs uppercase tracking-[3px]"
            >
              [ Exit ] 
            </button> 
            <div className="ring-1 ring-red/80 shadow-[0_0_40px_rgba(255,0,0,0.2)] rounded overflow-hidden bg-bg">
              <QuestCard
                key={`daily-focus-${focusedDailyQuest.id}`}
                name={focusedDailyQuest.name}
                sub={focusedDailyQuest.sub}
                isDaily={focusedDailyQuest.isDaily}
                tasks={focusedDailyQuest.tasks}
                completedTaskIds={completedTasks}
                progressMap={progressMap}
                onToggleTask={handleToggle}
                onIncrementTask={handleIncrement}
              />
            </div>
          </div>
        </div>
      )}

      {showLevelUp !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/85 backdrop-blur-md transition-opacity duration-300">
          <div className="glass-panel p-8 max-w-md w-full mx-4 text-center border-purple glow-purple animate-pulse">
            <div className="sys-font-mono text-[11px] tracking-[4px] text-purple2 mb-2 animate-sys-blink">
              [ SYSTEM NOTICE ]
            </div>
            <h2 className="sys-font-title text-4xl md:text-5xl font-bold text-gold glow-text mb-4 tracking-wider">
              LEVEL UP!
            </h2>
            <div className="w-16 h-[2px] bg-purple mx-auto mb-6" />
            <p className="sys-font-body text-base text-text/80 mb-6 leading-relaxed">
              Your capabilities have evolved. Your hard work has been recognized by the System. You have successfully broken your limits.
            </p>
            <div className="bg-bg2/50 border border-border/40 rounded p-4 mb-6">
              <div className="sys-font-mono text-xs text-muted mb-1 uppercase tracking-[1px]">New Status</div>
              <div className="sys-font-title text-2xl font-bold text-text mb-1">
                Level {showLevelUp}
              </div>
              <div className="sys-font-mono text-[11px] text-purple2 uppercase tracking-[2px]">
                {getRank(showLevelUp)}
              </div>
            </div>
            <button
              onClick={() => setShowLevelUp(null)}
              className="w-full py-3 bg-purple text-white font-bold sys-font-mono text-sm tracking-[3px] rounded hover:bg-purple2 transition-all uppercase shadow-[0_0_15px_rgba(122,95,255,0.3)]"
            >
              [ ARISE ]
            </button>
          </div>
        </div>
      )}
      {showWelcome && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/90 backdrop-blur-md transition-
                  opacity duration-300">
              <div className="glass-panel p-8 max-w-md w-full mx-4 text-center border-purple glow-purple animate-
                  fade-in">
                <div className="sys-font-mono text-[11px] tracking-[4px] text-purple2 mb-2 animate-sys-blink
                  uppercase">
                  [ System Initialization ]
                </div>
                <h2 className="sys-font-title text-3xl md:text-4xl font-bold text-white mb-4 tracking-wider">
                  WELCOME, PLAYER.
                </h2>
                <div className="w-16 h-[2px] bg-purple mx-auto mb-6" />
                <p className="sys-font-body text-sm text-text/80 mb-6 leading-relaxed">
                  You have met all the necessary requirements. The Secret Quest "Courage of the Weak" has been
                    completed.
                  <br /><br />
                  You have earned the right to become a Player. Will you accept?
                </p>
                <button
                  onClick={handleAcceptWelcome}
                  className="w-full py-3 bg-purple text-white font-bold sys-font-mono text-sm tracking-[3px] rounded
                  hover:bg-purple2 transition-all uppercase shadow-[0_0_15px_rgba(122,95,255,0.3)]"
                >
                  [ ACCEPT ]
                </button>
              </div>
            </div>
          )}
       {showGenerateModal && (
  <div 
    className="fixed inset-0 z-[100] flex items-center justify-center bg-bg/90 backdrop-blur-md overflow-y-auto"
    onClick={() => setShowGenerateModal(false)}
  >
    <div 
      className="glass-panel p-8 max-w-md w-full mx-4 border-purple glow-purple relative my-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="sys-font-mono text-[11px] tracking-[4px] text-purple2 mb-4 uppercase">
        [ Quest Generator ]
      </div>
      <p className="sys-font-body text-sm text-text/80 mb-4">
        What do you want to achieve?
      </p>
      <textarea 
        value={goalInput}
        onChange={e => setGoalInput(e.target.value)}
        placeholder="e.g., I want to learn Python"
        className="w-full p-3 bg-[#080810] border border-border rounded text-text text-sm mb-4 focus:border-purple focus:outline-none"
        disabled={generateMutation.isPending}
      />
      <div className="flex gap-2">
        <button
          onClick={handleGenerate}
          disabled={generateMutation.isPending || !goalInput.trim()}
          className="flex-1 py-3 bg-purple text-white font-bold sys-font-mono text-sm rounded hover:bg-purple2 transition-all uppercase disabled:opacity-50"
        >
          {generateMutation.isPending ? 'Forging Quest...' : '[ Generate ]'}
        </button>
        <button
          onClick={() => setShowGenerateModal(false)}
          disabled={generateMutation.isPending}
          className="py-3 px-4 bg-bg2 border border-border text-muted rounded sys-font-mono text-sm uppercase"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}     
      {showResetNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/90 backdrop-blur-md transition-opacity duration-300">
          <div className="glass-panel p-8 max-w-md w-full mx-4 text-center border-purple glow-purple animate-fade-in">
            <div className="sys-font-mono text-[11px] tracking-[4px] text-purple2 mb-2 animate-sys-blink uppercase">
              [ SYSTEM NOTIFICATION ]
            </div>
            <h2 className="sys-font-title text-3xl md:text-4xl font-bold text-white mb-4 tracking-wider">
              A NEW DAY BEGINS
            </h2>
            <div className="w-16 h-[2px] bg-purple mx-auto mb-6" />
            <p className="sys-font-body text-sm text-text/80 mb-6 leading-relaxed">
              Your Daily Quests have been reset. Yesterday's progress has been logged into the System Archive. 
              <br /><br />
              Will you grow stronger today?
            </p>
            <button
              onClick={() => setShowResetNotification(false)}
              className="w-full py-3 bg-purple text-white font-bold sys-font-mono text-sm tracking-[3px] rounded hover:bg-purple2 transition-all uppercase shadow-[0_0_15px_rgba(122,95,255,0.3)]"
            >
              [ ACCEPT ]
            </button>
          </div>
        </div>
      )}
    </>
  );
}