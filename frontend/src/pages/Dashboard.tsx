import { useEffect, useState } from 'react';
import { removeToken, progressApi, questsApi } from '../api/axios';

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
  if (level >= 31) return 'S';
  if (level >= 21) return 'A';
  if (level >= 16) return 'B';
  if (level >= 11) return 'C';
  if (level >= 6) return 'D';
  return 'E';
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
    <div className="min-h-screen bg-sl-dark p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-sl-red">HUNTER'S LOG</h1>
          <button onClick={handleLogout} className="text-sl-gray hover:text-white">
            Logout
          </button>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-sl-dark-card p-4 rounded-lg border border-gray-800">
              <div className="text-sl-gray text-sm">LEVEL</div>
              <div className="text-3xl font-bold text-sl-gold">{stats.level}</div>
            </div>
            <div className="bg-sl-dark-card p-4 rounded-lg border border-gray-800">
              <div className="text-sl-gray text-sm">RANK</div>
              <div className="text-3xl font-bold text-sl-red">{getRank(stats.level)}</div>
            </div>
            <div className="bg-sl-dark-card p-4 rounded-lg border border-gray-800">
              <div className="text-sl-gray text-sm">EXP</div>
              <div className="text-3xl font-bold text-white">{Math.floor(stats.exp)}</div>
            </div>
            <div className="bg-sl-dark-card p-4 rounded-lg border border-gray-800">
              <div className="text-sl-gray text-sm">STREAK</div>
              <div className="text-3xl font-bold text-white">{stats.streak}🔥</div>
            </div>
          </div>
        )}

        <div className="bg-sl-dark-card p-4 rounded-lg border border-gray-800 mb-8">
          <p className="text-lg italic text-sl-gray">"{quote.text}"</p>
          <p className="text-sm text-sl-red mt-2">— {quote.speaker}</p>
        </div>

        <div className="space-y-6">
          {quests.map((quest) => (
            <div key={quest.id} className="bg-sl-dark-card p-4 rounded-lg border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{quest.icon}</span>
                <div>
                  <h2 className="font-bold text-white">{quest.name}</h2>
                  <p className="text-sl-gray text-sm">{quest.sub}</p>
                </div>
              </div>
              <div className="space-y-2">
                {quest.tasks.map((task) => (
                  <label
                    key={task.id}
                    className={`flex items-center gap-3 p-3 rounded cursor-pointer transition ${
                      isCompleted(task.id)
                        ? 'bg-green-900/20 border border-green-800'
                        : 'bg-sl-dark border border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isCompleted(task.id)}
                      onChange={() => handleToggle(task.id)}
                      className="w-5 h-5 accent-sl-red"
                    />
                    <div className="flex-1">
                      <div className={isCompleted(task.id) ? 'line-through text-sl-gray' : 'text-white'}>
                        {task.name}
                      </div>
                      {task.note && (
                        <div className="text-sl-gray text-sm">{task.note}</div>
                      )}
                    </div>
                    <div className="text-sl-gold text-sm">+{task.exp} EXP</div>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}