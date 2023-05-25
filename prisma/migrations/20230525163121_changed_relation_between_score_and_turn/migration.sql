/*
  Warnings:

  - You are about to drop the column `scoreId` on the `Turn` table. All the data in the column will be lost.
  - Added the required column `turnId` to the `Score` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Turn" DROP CONSTRAINT "Turn_scoreId_fkey";

-- DropIndex
DROP INDEX "Turn_scoreId_key";

-- AlterTable
ALTER TABLE "Score" ADD COLUMN     "turnId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Turn" DROP COLUMN "scoreId";

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_turnId_fkey" FOREIGN KEY ("turnId") REFERENCES "Turn"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
