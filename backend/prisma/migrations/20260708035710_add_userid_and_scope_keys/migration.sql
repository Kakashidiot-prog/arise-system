/*
  Warnings:

  - A unique constraint covering the columns `[userId,key]` on the table `Quest` will be added.
  - A unique constraint covering the columns `[questId,key]` on the table `Task` will be added.
  - Added the required column `userId` to the `Quest` table, backfilled for existing rows.

*/
-- DropIndex
DROP INDEX "Quest_key_key";

-- DropIndex
DROP INDEX "Task_key_key";

-- AlterTable: add userId as NULLABLE first
ALTER TABLE "Quest" ADD COLUMN "userId" INTEGER;

-- Backfill: assign all existing quests to the one user in the system
UPDATE "Quest" SET "userId" = (SELECT "id" FROM "User" LIMIT 1);

-- Now safe to enforce NOT NULL
ALTER TABLE "Quest" ALTER COLUMN "userId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Quest_userId_idx" ON "Quest"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Quest_userId_key_key" ON "Quest"("userId", "key");

-- CreateIndex
CREATE UNIQUE INDEX "Task_questId_key_key" ON "Task"("questId", "key");

-- AddForeignKey
ALTER TABLE "Quest" ADD CONSTRAINT "Quest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;