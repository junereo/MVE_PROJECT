/*
  Warnings:

  - You are about to drop the column `userId` on the `Survey_Participants` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Survey_Participants" DROP CONSTRAINT "Survey_Participants_userId_fkey";

-- AlterTable
ALTER TABLE "Survey_Participants" DROP COLUMN "userId";

-- AddForeignKey
ALTER TABLE "Survey_Participants" ADD CONSTRAINT "Survey_Participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
