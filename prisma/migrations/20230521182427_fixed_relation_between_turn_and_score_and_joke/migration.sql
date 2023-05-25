-- DropForeignKey
ALTER TABLE "Turn" DROP CONSTRAINT "Turn_jokeId_fkey";

-- DropForeignKey
ALTER TABLE "Turn" DROP CONSTRAINT "Turn_scoreId_fkey";

-- AlterTable
ALTER TABLE "Turn" ALTER COLUMN "scoreId" DROP NOT NULL,
ALTER COLUMN "jokeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Turn" ADD CONSTRAINT "Turn_scoreId_fkey" FOREIGN KEY ("scoreId") REFERENCES "Score"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turn" ADD CONSTRAINT "Turn_jokeId_fkey" FOREIGN KEY ("jokeId") REFERENCES "Joke"("id") ON DELETE SET NULL ON UPDATE CASCADE;
