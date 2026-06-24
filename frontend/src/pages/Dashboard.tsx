import { useEffect, useState } from 'react';
import { removeToken, progressApi, questsApi, logsApi } from '../api/axios';
import SystemHeader from '../components/SystemHeader';
import StatCard from '../components/StatCard';
import ExpBar from '../components/ExpBar';
import QuestCard from '../components/QuestCard';


const SOLO_LEVELING_QUOTES = [
  { text: "I will keep leveling up until I reach the top.", speaker: "Sung Jinwoo" },
  { text: "The System uses me, and I use the system.", speaker: "Sung Jinwoo" },
  { text: "Let’s say I’m a hunter that grows stronger from each fight.", speaker: "Sung Jinwoo" },
  { text: "I’m always leveling up ceaselessly.", speaker: "Sung Jinwoo" },
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
  if (level >= 35) return 'S-Rank';
  if (level >= 25) return 'A-Rank';
  if (level >= 18) return 'B-Rank';
  if (level >= 10) return 'C-Rank';
  if (level >= 5) return 'D-Rank';
  return 'E-Rank';
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
  const [stats, setStats] = useState<Stats | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<'mind' | 'body' | 'life'  | 'report'>('mind');
  const [logs, setLogs] = useState<{ id: number; text: string; createdAt: string }[]>([]);
  const [weekActivity, setWeekActivity] = useState<Record<string, boolean>>({});
  const quote = getDailyQuote();
  

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, questsData, progressData, logsData, activityData] = await Promise.all([
        progressApi.getStats(),
        questsApi.getAll(),
        progressApi.getUserProgress(),
        logsApi.getAll(),
        progressApi.getWeekActivity(),
      ]);
      setStats(statsData);
      setQuests(questsData);
      setCompletedTasks(progressData.map((p: { taskId: number }) => p.taskId));
      setLogs(logsData);
      setWeekActivity(activityData);
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggle = async (taskId: number) => {
    await progressApi.toggle(taskId);
    loadData();
  };

  const handleLogout = () => {
    removeToken();
    window.location.href = '/login';
  };

  const isCompleted = (taskId: number) => completedTasks.includes(taskId);

  return (
    <div className="min-h-screen pb-20 relative z-10">
      <div className="max-w-[900px] mx-auto px-4">
        {stats && (
          <SystemHeader 
            name={stats.username} 
            rank={getRank(stats.level)} 
            level={stats.level} 
          />
        )}

        <div className="flex justify-end mb-4">
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

        {/* System Quote Panel */}
        <div className="glass-panel p-6 mb-8 border-purple/20">
          <p className="sys-font-body text-lg italic text-text/80 tracking-wide leading-relaxed">
            "{quote.text}"
          </p>
          <p className="sys-font-mono text-[11px] text-purple2 mt-4 uppercase tracking-[2px]">
            — {quote.speaker}
          </p>
        </div>

        {/* Tab Navigation */}
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

{/* Tab Content */}
<div className="space-y-3">
  {activeTab !== 'report' && quests
    .filter(q => q.category === activeTab)
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
    ))
  }
  {activeTab === 'report' && (
    <div className="space-y-6">
      {/* Weekly Consistency Panel */}
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

      {/* Log Console Terminal */}
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
          [ hunter's log · aria system · v1.0 ]
        </footer>
      </div>
    </div>
  );
}