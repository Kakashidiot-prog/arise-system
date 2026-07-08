import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { removeToken, progressApi, questsApi, logsApi } from '../api/axios';
import SystemHeader from '../components/SystemHeader';
import StatCard from '../components/StatCard';
import ExpBar from '../components/ExpBar';
import QuestCard from '../components/QuestCard';

const SOLO_LEVELING_QUOTES = [
  { text: "I will keep leveling up until I reach the top.", speaker: "Sung Jinwoo" },
  { text: "The System uses me, and I use the system.", speaker: "Sung Jinwoo" },
  { text: "Let's say I'm a hunter that grows stronger from each fight.", speaker: "Sung Jinwoo" },
  { text: "I'm always leveling up ceaselessly.", speaker: "Sung Jinwoo" },
  { text: "I'll become strong enough to protect everyone.", speaker: "Sung Jinwoo" },
  { text: "The day I stop working is the day I truly die.", speaker: "Sung Jinwoo" },
  { text: "We are what we choose to become.", speaker: "Sung Jinwoo" },
  { text: "Our greatest glory lies not in never falling, but in rising every time we fall.", speaker: "Sung Jinwoo" },
  { text: "Strength is born from adversity.", speaker: "Sung Jinwoo" },
  { text: "New challenges lead to new strengths.", speaker: "Sung Jinwoo" },
  { text: "Arise.", speaker: "Jinwoo" },
  { text: "I am the record of your struggle. I am the shadow of your growth.", speaker: "The System" },
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
  if (level >= 25) return 'A-Rank · Auth Conqueror';
  if (level >= 18) return 'B-Rank · Backend Slayer';
  if (level >= 10) return 'C-Rank · Full Stack Rising';
  if (level >= 5) return 'D-Rank · Frontend Awakened';
  return 'E-Rank · MERN Initiate';
}

function getLast7Days() {
  const result = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    result.push({ dateStr, dayName });
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
  tasks: { id: number; key: string; name: string; note: string; exp: number }[];
}

interface Stats {
  exp: number;
  level: number;
  streak: number;
  username: string;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'mind' | 'body' | 'life' | 'report'>('mind');
  const [showLevelUp, setShowLevelUp] = useState<number | null>(null);
  const quote = getDailyQuote();
  const queryClient = useQueryClient();

  const { data: stats } = useQuery<Stats>({
    queryKey: ['stats'],
    queryFn: progressApi.getStats,
  });

  const { data: quests = [] } = useQuery<Quest[]>({
    queryKey: ['quests'],
    queryFn: questsApi.getAll,
  });

  const { data: progressData = [] } = useQuery<{ taskId: number }[]>({
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

  const completedTasks = progressData.map((p) => p.taskId);

  const toggleMutation = useMutation({
    mutationFn: (taskId: number) => progressApi.toggle(taskId),
    onSuccess: () => {
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

  const handleLogout = () => {
    removeToken();
    window.location.href = '/login';
  };

  return (
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

        <div className="glass-panel p-6 mb-8 border-purple/20">
          <p className="sys-font-body text-lg italic text-text/80 tracking-wide leading-relaxed">
            "{quote.text}"
          </p>
          <p className="sys-font-mono text-[11px] text-purple2 mt-4 uppercase tracking-[2px]">
            — {quote.speaker}
          </p>
        </div>

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
              {tab === 'mind' ? 'Dev Skills' : tab === 'body' ? 'Physical' : tab === 'life' ? 'Life Goals' : 'Report'}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {activeTab !== 'report' && quests
            .filter((q) => q.category === activeTab)
            .map((quest) => (
              <QuestCard
                key={quest.id}
                name={quest.name}
                sub={quest.sub}
                icon={quest.icon}
                tasks={quest.tasks}
                completedTaskIds={completedTasks}
                onToggleTask={handleToggle}
              />
            ))}

          {activeTab === 'report' && (
            <div className="space-y-6">
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
                          {day.dayName}
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
                  [ System Log Console ]
                </h3>
                <div className="max-h-[300px] overflow-y-auto space-y-2 bg-bg/50 border border-border/40 p-4 rounded font-mono text-[11px] leading-relaxed">
                  {logs.length === 0 ? (
                    <p className="text-muted italic">[ No system records registered yet ]</p>
                  ) : (
                    logs.map((log) => (
                      <div key={log.id} className="text-text/80 hover:text-text transition-colors">
                        <span className="text-muted select-none">
                          [{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]
                        </span>{' '}
                        <span className={log.text.startsWith('Completed') ? 'text-green' : 'text-purple2'}>
                          {log.text}
                        </span>
                      </div>
                    ))
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
    </div>
  );
}