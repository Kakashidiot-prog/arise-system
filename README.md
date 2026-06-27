# ⚔️ Hunter's Log | The Solo Leveling Habit Tracker

An advanced, gamified habit-tracking and productivity platform inspired by the *Solo Leveling* webtoon. This system translates real-world daily routines, developer skills, and life goals into quest gates, yielding experience points (EXP), level-ups, and active streak increments.

---

## 🏗️ The System Architecture ("The Pattern")

This project is built using a modern **decoupled full-stack architecture**. Below is the flow of how data travels through the system:

```
[ React / Vite Frontend ] (Port 5173)
       │
       │  (Axios HTTP Requests + JWT Bearer Token)
       ▼
[ NestJS Backend API ] (Port 3000)
       │
       │  (Prisma ORM Relations & Queries)
       ▼
[ PostgreSQL Cloud Database ] (Neon Tech Serverless)
```

1. **Frontend (UI Layer)**: React + TypeScript handles the interactive glassmorphism interface, tracks state changes, and secures routes with a dynamic JWT auth guard.
2. **Backend (Logic Layer)**: NestJS exposes structured REST endpoints, implements authorization guards, logs administrative changes, and runs automated daily resets via scheduled CRON jobs.
3. **Database (Data Layer)**: PostgreSQL hosts relational tables with cascade-delete constraints, mapped and queried via Prisma ORM.

---

## ⚡ Tech Stack

* **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Axios, React Router Dom.
* **Backend**: NestJS, TypeScript, Prisma ORM, Passport.js (JWT Auth), NestJS Schedule (Cron).
* **Database**: PostgreSQL (Neon Serverless).

---

## ⚔️ Key Features

### 1. Gamified Progression System
* **Level Formula**: `Level = Math.floor(TotalEXP / 5) + 1` (calculated dynamically on the fly based on completed task EXP).
* **Rank System**: Dynamically maps user levels to hunter ranks (`E-Rank` up to `S-Rank`).
* **Active Streak Tracker**: Tracks daily task completions and increments streaks if consecutive days are met, resetting automatically if a gap day is detected.

### 2. Quest Gates (CRUD Operations)
* Users can open, update, and clear quest gates (categories like Dev Skills, Physical, and Life Goals) with custom tasks.
* Secure REST routes manage database mutations with strict data transfer validation.

### 3. Automated Daily Reset
* A background scheduler (`@Cron`) wakes up at midnight to uncheck tasks, prepping the hunter's log for the next day's grind while preserving historical progress logs.

---

## 🛡️ Developer Pedigree: OJT Capstone Project

### **PGC GuideKiosk: Navigation and Service Directory**
* **Role**: Full-Stack Developer Intern (Provincial Government of Cavite Capitol Complex)
* **Scope**: Built a custom navigation mapping and directory system covering **23 complex government buildings**.
* **Key Accomplishments**:
  * Conducted field data collection, structuring hundreds of offices, services, and locations into a unified relational database.
  * Developed an interactive administration dashboard allowing building mapping, coordinate adjustments, and department CRUD operations.
  * Delivered a user-friendly kiosk interface to assist public visitors in navigating complex routing paths between departments.

---

## ⚙️ Running Locally

### 1. Database Setup
Ensure you have a `.env` file inside `/backend` containing your connection string:
```env
DATABASE_URL="your-postgresql-connection-string"
JWT_SECRET="your-jwt-secret"
```

### 2. Spin Up Backend
```bash
cd backend
npm install
npx prisma db push
npm run start:dev
```

### 3. Spin Up Frontend
```bash
cd frontend
npm install
npm run dev
```
