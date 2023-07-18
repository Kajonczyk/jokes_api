/*
  Warnings:

  - A unique constraint covering the columns `[gameId]` on the table `Turn` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Turn_gameId_key" ON "Turn"("gameId");
