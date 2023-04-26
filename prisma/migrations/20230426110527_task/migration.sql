/*
  Warnings:

  - Changed the type of `todoListId` on the `tasks` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "todoListId",
ADD COLUMN     "todoListId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_todoListId_fkey" FOREIGN KEY ("todoListId") REFERENCES "lists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
