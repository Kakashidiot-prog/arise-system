import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const mindQuests = [
    {
      key: 'm1', name: 'Gate 1 — JS Foundations',
      icon: '01', sub: 'Weeks 1–2 · +8 EXP',
      category: 'mind', order: 1,
      tasks: [
        { key: 'm1t1', name: 'const, let, var — scope and closures', note: 'Why does my variable disappear inside a function?', exp: 2 },
        { key: 'm1t2', name: '.map() .filter() .reduce() — array methods', note: 'These return new arrays. Understand what that means.', exp: 2 },
        { key: 'm1t3', name: 'Promises and async/await', note: 'Why your fetch calls break silently', exp: 2 },
        { key: 'm1t4', name: 'Destructuring, spread, optional chaining', note: 'Modern JS syntax you will see everywhere', exp: 1 },
        { key: 'm1t5', name: 'ES Modules — import vs require', note: 'Why React uses import but old Node used require', exp: 1 },
      ],
    },
    {
      key: 'm2', name: 'Gate 2 — React',
      icon: '02', sub: 'Weeks 3–4 · +8 EXP',
      category: 'mind', order: 2,
      tasks: [
        { key: 'm2t1', name: 'Components — functions that return UI', note: 'Props flow down, events flow up. Draw this.', exp: 2 },
        { key: 'm2t2', name: 'useState — why re-renders happen', note: 'Mutating state directly causes bugs. Understand why.', exp: 2 },
        { key: 'm2t3', name: 'useEffect — dependency array and cleanup', note: 'Why does this run 5 times? Dep array is your answer.', exp: 2 },
        { key: 'm2t4', name: 'Lifting state to parent components', note: 'When siblings need the same data', exp: 1 },
        { key: 'm2t5', name: 'React Router — client-side navigation', note: 'URL changes without full page reload', exp: 1 },
      ],
    },
    {
      key: 'm3', name: 'Gate 3 — Node + Express',
      icon: '03', sub: 'Weeks 5–6 · +8 EXP',
      category: 'mind', order: 3,
      tasks: [
        { key: 'm3t1', name: 'Node.js — JavaScript outside the browser', note: 'Event loop basics, non-blocking I/O', exp: 2 },
        { key: 'm3t2', name: 'HTTP methods — GET POST PUT DELETE', note: 'Understand the intent, not just the name', exp: 2 },
        { key: 'm3t3', name: 'Express routes, middleware, controllers', note: 'Request flows through middleware before hitting route', exp: 2 },
        { key: 'm3t4', name: 'Error handling middleware', note: 'The (err, req, res, next) signature', exp: 1 },
        { key: 'm3t5', name: 'Environment variables with dotenv', note: 'Never hardcode secrets in your code', exp: 1 },
      ],
    },
    {
      key: 'm4', name: 'Gate 4 — NestJS + PostgreSQL',
      icon: '04', sub: 'Week 7 · +6 EXP',
      category: 'mind', order: 4,
      tasks: [
        { key: 'm4t1', name: 'NestJS — modules, controllers, services', note: 'The architecture you are building right now', exp: 2 },
        { key: 'm4t2', name: 'Prisma — schema design and ORM', note: 'Type-safe DB access instead of raw SQL strings', exp: 2 },
        { key: 'm4t3', name: 'CRUD operations with Prisma', note: 'findMany, create, update, delete', exp: 1 },
        { key: 'm4t4', name: 'JWT auth — guards and strategies', note: 'Protecting routes with bearer tokens', exp: 1 },
      ],
    },
    {
      key: 'm5', name: 'Final Gate — Ship It',
      icon: '05', sub: 'Week 8 · +5 EXP',
      category: 'mind', order: 5,
      tasks: [
        { key: 'm5t1', name: 'CORS + Axios interceptors', note: 'Connect React frontend to NestJS backend', exp: 1 },
        { key: 'm5t2', name: 'Environment variables in production', note: 'Never expose secrets in deployed code', exp: 1 },
        { key: 'm5t3', name: 'Deploy backend on Render', note: 'Your API live on the internet', exp: 1 },
        { key: 'm5t4', name: 'Deploy frontend on Vercel', note: 'Your UI live on the internet', exp: 1 },
        { key: 'm5t5', name: 'Explain every part to someone else', note: 'If you can teach it, you own it', exp: 1 },
      ],
    },
  ];

  const bodyQuests = [
    {
      key: 'b1', name: 'Bodyweight Foundation',
      icon: 'B1', sub: 'Daily · +1 EXP per session',
      category: 'body', order: 6,
      tasks: [
        { key: 'b1t1', name: 'Push-ups — 3 sets', note: 'Start 3x10. Progress to 3x20 before adding reps.', exp: 0.25 },
        { key: 'b1t2', name: 'Squats — 3 sets', note: 'Bodyweight first. Form over weight.', exp: 0.25 },
        { key: 'b1t3', name: 'Plank — 60 seconds', note: 'Build to 2 min. Core carries everything.', exp: 0.25 },
        { key: 'b1t4', name: 'Pull-ups or inverted rows', note: 'Doorframe bar or table rows if no equipment.', exp: 0.25 },
      ],
    },
    {
      key: 'b2', name: 'Cardio',
      icon: 'B2', sub: '3x per week · +1 EXP per session',
      category: 'body', order: 7,
      tasks: [
        { key: 'b2t1', name: '30 min run or brisk walk', note: 'Zone 2 pace — you can still hold a conversation.', exp: 0.5 },
        { key: 'b2t2', name: '10 min HIIT finisher', note: '20s work, 10s rest, 8 rounds.', exp: 0.25 },
        { key: 'b2t3', name: 'Stretch and cool down — 10 min', note: 'Hip flexors, hamstrings, shoulders.', exp: 0.25 },
      ],
    },
    {
      key: 'b3', name: 'Nutrition and Recovery',
      icon: 'B3', sub: 'Daily · non-negotiable',
      category: 'body', order: 8,
      tasks: [
        { key: 'b3t1', name: 'Drink 2–3L water', note: 'Set a phone alarm every 2 hours.', exp: 0.25 },
        { key: 'b3t2', name: 'Protein with every meal', note: 'Egg, chicken, tofu — 0.8g per kg bodyweight.', exp: 0.25 },
        { key: 'b3t3', name: 'Sleep 7–8 hours', note: 'Gains happen during sleep, not training.', exp: 0.25 },
        { key: 'b3t4', name: 'No phone 30 min before bed', note: 'Blue light kills melatonin. Try it for one week.', exp: 0.25 },
      ],
    },
  ];

  const lifeQuests = [
    {
      key: 'l1', name: 'Career — Land First Dev Job',
      icon: 'L1', sub: 'Priority one · life-changing EXP',
      category: 'life', order: 9,
      tasks: [
        { key: 'l1t1', name: "Finish Hunter's Log full-stack app", note: 'This is your portfolio piece. Ship it.', exp: 3 },
        { key: 'l1t2', name: 'Push PGC-FIS to GitHub with documentation', note: 'Government system on your profile = credibility.', exp: 2 },
        { key: 'l1t3', name: 'Apply to 3 jobs per week', note: 'Junior dev, apprentice, intern-to-hire roles.', exp: 1 },
        { key: 'l1t4', name: 'Practice 2 interview questions per day', note: 'Arrays, objects, async — basics they always ask.', exp: 1 },
        { key: 'l1t5', name: 'Write a 1-page resume — one page only', note: 'List PGC system, tech stack, GitHub link.', exp: 1 },
      ],
    },
    {
      key: 'l2', name: 'Finance — Emergency Foundation',
      icon: 'L2', sub: 'Start small, stay consistent',
      category: 'life', order: 10,
      tasks: [
        { key: 'l2t1', name: 'Save P100–500 per week — no exceptions', note: 'Even P100 is the habit. The amount grows later.', exp: 1 },
        { key: 'l2t2', name: 'Track every expense for one month', note: 'Use a notes app. Just write it down.', exp: 1 },
        { key: 'l2t3', name: 'Learn one money concept this week', note: 'Emergency fund, compound interest, 50-30-20 rule.', exp: 1 },
        { key: 'l2t4', name: 'Build a 1-month expense buffer', note: 'First financial goal. It changes how you think.', exp: 2 },
      ],
    },
    {
      key: 'l3', name: 'Mental Health — Stay Functional',
      icon: 'L3', sub: 'Non-negotiable maintenance',
      category: 'life', order: 11,
      tasks: [
        { key: 'l3t1', name: 'No doom scrolling after 10pm', note: 'Replace with reading, journaling, or just sleeping.', exp: 0.5 },
        { key: 'l3t2', name: 'Write 3 things that went okay today', note: 'Not good. Just okay. Lower the bar on hard days.', exp: 0.5 },
        { key: 'l3t3', name: 'Talk to one person today — anyone', note: 'Isolation compounds everything. One message counts.', exp: 0.5 },
        { key: 'l3t4', name: 'Do one thing just because you enjoy it', note: 'Not productive. Not useful. Just yours.', exp: 0.5 },
      ],
    },
  ];

  const allQuests = [...mindQuests, ...bodyQuests, ...lifeQuests];

  for (const q of allQuests) {
    const quest = await prisma.quest.upsert({
      where: { key: q.key },
      update: {
        name: q.name,
        icon: q.icon,
        sub: q.sub,
        category: q.category,
        order: q.order,
      },
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
        update: {
          name: t.name,
          note: t.note,
          exp: t.exp,
          questId: quest.id,
        },
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

  console.log('Database seeded successfully with v2 quests');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());