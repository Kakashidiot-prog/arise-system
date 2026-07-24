-- AlterTable
ALTER TABLE "Quest" ADD COLUMN     "isDaily" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastResetDate" TEXT;
