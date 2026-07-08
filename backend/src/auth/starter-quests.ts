export const STARTER_QUESTS = [
  {
    key: 'sq_tutorial_1',
    name: 'Gate 1 — System Initialization',
    icon: 'SYS',
    sub: 'Tutorial · +3 EXP',
    category: 'mind',
    order: 1,
    tasks: [
      { key: 'sq_t1', name: 'Acknowledge the System', note: 'Click this task to gain your first EXP.', exp: 1 },
      { key: 'sq_t2', name: 'Check your Status Window', note: 'View your Level and total EXP at the top of the dashboard.', exp: 1 },
      { key: 'sq_t3', name: 'Explore the Interface', note: 'Check the different tabs: Dev Skills, Physical, Life Goals, Report.', exp: 1 },
    ],
  },
  {
    key: 'sq_tutorial_2',
    name: 'The Daily Quest',
    icon: 'STR',
    sub: 'Daily · +1.5 EXP',
    category: 'body',
    order: 2,
    tasks: [
      { key: 'sq_t4', name: '10 Push-ups', note: 'A journey of a thousand miles begins with a single push-up.', exp: 0.5 },
      { key: 'sq_t5', name: '10 Squats', note: 'Build your physical foundation.', exp: 0.5 },
      { key: 'sq_t6', name: '10 Sit-ups', note: 'Core strength is essential for a Hunter.', exp: 0.5 },
    ],
  },
  {
    key: 'sq_tutorial_3',
    name: 'Chart Your Own Path',
    icon: 'LFE',
    sub: 'Main Quest · +2 EXP',
    category: 'life',
    order: 3,
    tasks: [
      { key: 'sq_t7', name: 'Identify your main life goal', note: 'What is your equivalent of becoming an S-Rank Hunter?', exp: 1 },
      { key: 'sq_t8', name: 'Await future System Updates', note: 'The ability to create and edit custom Gates is coming soon.', exp: 1 },
    ],
  },
];