/*
  Warnings:

  - You are about to drop the `Game` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Room` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GameToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_roomId_fkey";

-- DropForeignKey
ALTER TABLE "Joke" DROP CONSTRAINT "Joke_gameId_fkey";

-- DropForeignKey
ALTER TABLE "Score" DROP CONSTRAINT "Score_gameId_fkey";

-- DropForeignKey
ALTER TABLE "_GameToUser" DROP CONSTRAINT "_GameToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_GameToUser" DROP CONSTRAINT "_GameToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_roomId_fkey";

-- DropIndex
DROP INDEX "Joke_gameId_key";

-- DropTable
DROP TABLE "Game";

-- DropTable
DROP TABLE "Room";

-- DropTable
DROP TABLE "_GameToUser";

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "Turn" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "turnUserId" TEXT NOT NULL,
    "nextTurnId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "scoreId" TEXT NOT NULL,
    "jokeId" TEXT NOT NULL,

    CONSTRAINT "Turn_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Turn_scoreId_key" ON "Turn"("scoreId");

-- CreateIndex
CREATE UNIQUE INDEX "Turn_jokeId_key" ON "Turn"("jokeId");

-- AddForeignKey
ALTER TABLE "Turn" ADD CONSTRAINT "Turn_scoreId_fkey" FOREIGN KEY ("scoreId") REFERENCES "Score"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turn" ADD CONSTRAINT "Turn_jokeId_fkey" FOREIGN KEY ("jokeId") REFERENCES "Joke"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
