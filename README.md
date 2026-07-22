# ARISE

A full-stack, RPG-themed productivity system that turns real-life goals into trackable quests. Complete tasks, earn EXP, level up, and generate personalized goal roadmaps using AI — inspired by Solo Leveling.

**Live demo:** https://hunters-log.vercel.app/

## Features

- **Quest & Task System** — organize goals into categories (Intelligence, Strength, Vitality), track individual tasks
- **Progressive Tasks** — supports both checkbox tasks and counter-based tasks (e.g., "50/100 push-ups") with visual progress bars
- **AI Quest Generator** — describe a goal in plain English, and Gemini AI breaks it into a structured, leveled quest with real tasks
- **Optimistic UI** — instant feedback on task completion and progress updates, no lag waiting on the server
- **EXP & Leveling System** — earn EXP per task, level up, unlock Hunter ranks (E-Rank through S-Rank)
- **Secure Auth** — JWT-based authentication with ownership-scoped API endpoints (users can only access their own data)
- **Task Editing** — full CRUD for quests and tasks with backend validation

## Tech Stack

**Backend:** NestJS, TypeScript, Prisma ORM, PostgreSQL (Neon), JWT auth, class-validator
**Frontend:** React, Vite, TypeScript, TanStack React Query, Tailwind CSS
**AI Integration:** Google Gemini API
**Deployment:** Railway (backend), Vercel (frontend)
git 
## Architecture Highlights

- Scoped Prisma queries enforce per-user data isolation at the database level, not just in application logic
- Optimistic mutations with automatic rollback on failure, using React Query's `onMutate` / `onError` / `onSettled` lifecycle
- AI-generated content is parsed and validated before being persisted, with graceful error handling for malformed model responses

## Running Locally

```bash
# Backend
cd backend
npm install
npx prisma migrate dev
npm run start:dev

# Frontend
cd frontend
npm install
npm run dev
```

Requires a `.env` file in `backend/` with `DATABASE_URL`, `JWT_SECRET`, and `GEMINI_API_KEY`.

## Author

Built by Carl (Kakashidiot) as a personal project to sharpen full-stack development skills, with a focus on backend architecture, secure API design, and AI integration.