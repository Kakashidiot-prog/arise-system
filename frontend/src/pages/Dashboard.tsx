import { useEffect, useState } from 'react';
import { removeToken, progressApi, questsApi } from '../api/axios';
import SystemHeader from '../components/SystemHeader';
import StatCard from '../components/StatCard';
import ExpBar from '../components/ExpBar';

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
  const quote = getDailyQuote();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, questsData, progressData] = await Promise.all([
        progressApi.getStats(),
        questsApi.getAll(),
        progressApi.getUserProgress(),
      ]);
      setStats(statsData);
      setQuests(questsData);
      setCompletedTasks(progressData.map((p: { taskId: number }) => p.taskId));
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

        {/* Quests Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-2">
            <span className="sys-font-mono text-[11px] tracking-[3px] text-muted uppercase">Active Quests</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {quests.map((quest) => (
            <div key={quest.id} className="glass-panel overflow-hidden border-border/60 hover:border-border transition-colors">
              <div className="flex items-center gap-4 p-5 border-b border-border/40 bg-bg2/50">
                <div className="w-10 h-10 rounded-lg bg-bg3 border border-border flex items-center justify-center text-xl">
                  {quest.icon}
                </div>
                <div>
                  <h2 className="sys-font-title text-sm tracking-wider text-text">{quest.name}</h2>
                  <p className="sys-font-mono text-[11px] text-muted">{quest.sub}</p>
                </div>
              </div>

              <div className="p-4 space-y-2">
                {quest.tasks.map((task) => (
                  <label
                    key={task.id}
                    className={`flex items-start gap-4 p-3 rounded-lg cursor-pointer transition-all border ${
                      isCompleted(task.id)
                        ? 'bg-green2/5 border-green2/30 opacity-70'
                        : 'bg-bg/40 border-border/20 hover:border-purple/40 hover:bg-bg2/30'
                    }`}
                  >
                    <div className="pt-1">
                      <input
                        type="checkbox"
                        checked={isCompleted(task.id)}
                        onChange={() => handleToggle(task.id)}
                        className="hidden"
                      />
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                        isCompleted(task.id) 
                          ? 'bg-green2 border-green2 text-bg' 
                          : 'border-border2 bg-bg hover:border-purple'
                      }`}>
                        {isCompleted(task.id) && <span className="text-[10px] font-bold">✓</span>}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className={`sys-font-body text-[15px] font-medium leading-tight ${
                        isCompleted(task.id) ? 'line-through text-muted' : 'text-text'
                      }`}>
                        {task.name}
                      </div>
                      {task.note && (
                        <div className="sys-font-mono text-[11px] text-muted mt-1 leading-tight">
                          {task.note}
                        </div>
                      )}
                    </div>
                    
                    <div className="sys-font-mono text-[11px] text-gold mt-1 whitespace-nowrap">
                      +{task.exp} EXP
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <footer className="mt-20 text-center sys-font-mono text-[10px] text-muted2 tracking-[2px] uppercase pb-10">
          [ hunter's log · aria system · v1.0 ]
        </footer>
      </div>
    </div>
  );
}