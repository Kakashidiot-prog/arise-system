-- AlterTable
ALTER TABLE "Progress" ADD COLUMN     "currentValue" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "targetValue" INTEGER,
ADD COLUMN     "taskType" TEXT NOT NULL DEFAULT 'checkbox';
