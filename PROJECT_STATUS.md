# Hunter's Log - Project Overview
A Solo Leveling-inspired productivity tracker to level up your real-life skills.

---

## 🛠 Tech Stack (The S-Rank Builder)
| Layer | Tech |
| :--- | :--- |
| **Frontend** | React 18 + TypeScript (Vite) |
| **Styling** | Tailwind CSS + Custom CSS Variables (Cinzel/Rajdhani fonts) |
| **Backend** | NestJS + TypeScript |
| **Database** | PostgreSQL (Hosted on Neon.tech) |
| **ORM** | Prisma |
| **Auth** | JWT (JSON Web Tokens) + Bcryptjs |

---

## 📊 Current Status

### ✅ Backend (Complete & Verified)
- `src/auth/` - JWT authentication with guards.
- `src/quests/` - Quest/Gate fetching logic.
- `src/progress/` - EXP tracking, level calculation (EXP/5 + 1), and task toggling.
- `src/prisma/` - Database schema (User, Quest, Task, Progress, Log).
- **Seed Data**: Successfully populated with Mind Gates, Physical Quests, and Life Goals.

### ⚠️ Frontend (In Progress - NEEDS REBUILD)
- **Current State**: Generic Tailwind UI (Lost the Solo Leveling aesthetic).
- **Goal**: Replicate `solo-leveling-tracker.html` EXACTLY in React components.

---

## 🗺 Implementation Plan

### Phase 1: Restore Visual Integrity
1.  **Fonts & Global CSS**: Import 'Cinzel', 'Share Tech Mono', and 'Rajdhani' into `index.html`.
2.  **CSS Variables**: Migrate the exact color palette from the HTML reference to `index.css`.
3.  **Componentization**: Break the HTML into `SystemHeader`, `StatCard`, `ExpBar`, and `QuestCard`.

### Phase 2: React Logic
1.  **State Management**: Use `useEffect` to fetch user stats and quests on load.
2.  **Interactive Tasks**: Connect the task checkboxes to `POST /progress/toggle`.
3.  **Toasts**: Re-implement the "Level Up" and "Quest Cleared" system alerts.

---

## 🗝 Key System Formulas
- **Level**: `Math.floor(TotalEXP / 5) + 1`
- **Ranks**:
    - 0-4 EXP: Initiate
    - 5-9 EXP: Apprentice
    - 10-17 EXP: Developer
    - 18-24 EXP: Senior Dev
    - 25-34 EXP: Tech Lead
    - 35-49 EXP: Architect
    - 50+ EXP: Shadow Monarch

---

## 📡 API Endpoints
- `POST /auth/register` - Create account
- `POST /auth/login` - Get JWT Token
- `GET /quests` - Fetch all gates
- `GET /progress/stats` - Get current Level/EXP/Streak
- `POST /progress/toggle` - Check/Uncheck task
