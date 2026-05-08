# Solo Leveling System Logic

## Level Up Formula
- `Level = Math.floor(TotalEXP / 5) + 1`
- Every 5 EXP points results in a Level Up.

## Rank Thresholds
| EXP Threshold | Rank Title |
| :--- | :--- |
| 0 | E-Rank · MERN Initiate |
| 5 | D-Rank · Frontend Awakened |
| 10 | C-Rank · Full Stack Rising |
| 18 | B-Rank · Backend Slayer |
| 25 | A-Rank · Auth Conqueror |
| 35 | S-Rank · Shadow Monarch |

## Streak Calculation
- A day is considered "active" if at least one task is completed.
- Streak increments if the `lastActiveDate` was yesterday.
- Streak resets to 1 if more than 24 hours have passed since the last active date.
