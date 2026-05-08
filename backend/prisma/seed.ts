import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const mindQuests = [
    {
      key: 'm1', name: 'Gate 1 — JS Foundations',
      icon: '⚡', sub: 'Weeks 1–2 · +8 EXP total',
      category: 'mind', order: 1,
      tasks: [
        { key: 'm1t1', name: 'Understand const, let, scope & closures', note: 'Why does my variable disappear?', exp: 2 },
        { key: 'm1t2', name: 'Master .map() .filter() .reduce()', note: 'Understand what they return', exp: 2 },
        { key: 'm1t3', name: 'Promises, async/await', note: 'Why your fetch calls break silently', exp: 2 },
        { key: 'm1t4', name: 'Destructuring, spread, optional chaining', note: 'Modern JS patterns', exp: 1 },
        { key: 'm1t5', name: 'import/export — ES modules vs CommonJS', note: 'Why React uses import but Node used require', exp: 1 },
      ],
    },
    {
      key: 'm2', name: 'Gate 2 — React Mastery',
      icon: '⚛', sub: 'Weeks 3–4 · +8 EXP total',
      category: 'mind', order: 2,
      tasks: [
        { key: 'm2t1', name: 'Components — functions that return UI', note: 'Props down, events up', exp: 2 },
        { key: 'm2t2', name: 'useState — why re-renders happen', note: 'Mutating state directly = bugs', exp: 2 },
        { key: 'm2t3', name: 'useEffect — dependency array & cleanup', note: 'Why does this run 5 times?', exp: 2 },
        { key: 'm2t4', name: 'Lifting state up to parent components', note: 'When siblings need the same data', exp: 1 },
        { key: 'm2t5', name: 'React Router — URL changes render components', note: 'Client-side routing basics', exp: 1 },
      ],
    },
    {
      key: 'm3', name: 'Gate 3 — Node + Express',
      icon: '🖥', sub: 'Weeks 5–6 · +8 EXP total',
      category: 'mind', order: 3,
      tasks: [
        { key: 'm3t1', name: 'Node.js — JS outside the browser', note: 'Event loop, non-blocking I/O', exp: 2 },
        { key: 'm3t2', name: 'HTTP methods — GET POST PUT DELETE', note: 'Understand the intent', exp: 2 },
        { key: 'm3t3', name: 'Express routes, controllers, middleware', note: 'Request → middleware → controller → response', exp: 2 },
        { key: 'm3t4', name: 'Error handling middleware — 4 params', note: 'The (err, req, res, next) signature', exp: 1 },
        { key: 'm3t5', name: 'dotenv — never hardcode secrets', note: 'Environment variables', exp: 1 },
      ],
    },
    {
      key: 'm4', name: 'Gate 4 — NestJS + PostgreSQL',
      icon: '🗄', sub: 'Week 7 · +6 EXP total',
      category: 'mind', order: 4,
      tasks: [
        { key: 'm4t1', name: 'NestJS Modules, Controllers, Services', note: 'The architecture you are building right now', exp: 2 },
        { key: 'm4t2', name: 'Prisma schema — models and relations', note: 'Type-safe database access', exp: 2 },
        { key: 'm4t3', name: 'CRUD operations with Prisma', note: 'findMany, create, update, delete', exp: 1 },
        { key: 'm4t4', name: 'JWT Auth — guards and strategies', note: 'Protecting your routes', exp: 1 },
      ],
    },
    {
      key: 'm5', name: 'Final Boss — Deploy & Ship',
      icon: '👑', sub: 'Week 8 · +5 EXP',
      category: 'mind', order: 5,
      tasks: [
        { key: 'm5t1', name: 'CORS + Axios interceptors', note: 'Connect React to your backend', exp: 1 },
        { key: 'm5t2', name: 'Environment variables in production', note: 'Never expose secrets', exp: 1 },
        { key: 'm5t3', name: 'Deploy backend to Render', note: 'Your API live on the internet', exp: 1 },
        { key: 'm5t4', name: 'Deploy frontend to Vercel', note: 'Your UI live on the internet', exp: 1 },
        { key: 'm5t5', name: 'Show it to someone and explain every part', note: 'If you can teach it you own it', exp: 1 },
      ],
    },
  ];

  const bodyQuests = [
    {
      key: 'b1', name: 'Daily Grind — Bodyweight',
      icon: '💪', sub: 'Every day · +1 EXP per session',
      category: 'body', order: 6,
      tasks: [
        { key: 'b1t1', name: 'Push-ups — 3 sets', note: 'Start 3×10, progress to 3×20', exp: 0.25 },
        { key: 'b1t2', name: 'Squats — 3 sets', note: 'Bodyweight first', exp: 0.25 },
        { key: 'b1t3', name: 'Plank — hold 60s', note: 'Build to 2 min', exp: 0.25 },
        { key: 'b1t4', name: 'Pull-ups or inverted rows', note: 'Doorframe bar or table rows', exp: 0.25 },
      ],
    },
    {
      key: 'b2', name: 'Cardio Gate',
      icon: '🏃', sub: '3× per week · +1 EXP per session',
      category: 'body', order: 7,
      tasks: [
        { key: 'b2t1', name: '30 min run or brisk walk', note: 'Zone 2 — can hold a conversation', exp: 0.5 },
        { key: 'b2t2', name: '10 min HIIT finisher', note: '20s work / 10s rest × 8 rounds', exp: 0.25 },
        { key: 'b2t3', name: 'Stretch & cool down — 10 min', note: 'Hip flexors, hamstrings, shoulders', exp: 0.25 },
      ],
    },
    {
      key: 'b3', name: 'Hunter Diet Protocol',
      icon: '🥗', sub: 'Daily · +0.5 EXP per day',
      category: 'body', order: 8,
      tasks: [
        { key: 'b3t1', name: 'Drink 2–3L water', note: 'Set an alarm every 2 hrs', exp: 0.25 },
        { key: 'b3t2', name: 'Eat protein with every meal', note: 'Egg, chicken, tofu — 0.8g/kg bodyweight', exp: 0.25 },
      ],
    },
    {
      key: 'b4', name: 'Recovery Arc',
      icon: '😴', sub: 'Non-negotiable · +0.5 EXP per day',
      category: 'body', order: 9,
      tasks: [
        { key: 'b4t1', name: 'Sleep 7–8 hours', note: 'Muscle is built during sleep', exp: 0.25 },
        { key: 'b4t2', name: 'No phone 30 min before bed', note: 'Blue light kills melatonin', exp: 0.25 },
      ],
    },
  ];

  for (const q of [...mindQuests, ...bodyQuests]) {
    const quest = await prisma.quest.upsert({
      where: { key: q.key },
      update: {},
      create: {
        key: q.key,
        name: q.name,
        icon: q.icon,
        sub: q.sub,
        category: q.category,
        order: q.order,
      },
    });

    for (const t of q.tasks) {
      await prisma.task.upsert({
        where: { key: t.key },
        update: {},
        create: {
          key: t.key,
          name: t.name,
          note: t.note,
          exp: t.exp,
          questId: quest.id,
        },
      });
    }
  }

  console.log('Database seeded successfully');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());