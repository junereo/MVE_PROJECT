/*
  Warnings:

  - You are about to drop the column `version` on the `Survey_Result` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `genre` to the `Survey` table without a default value. This is not possible if the table is not empty.
  - Made the column `music_title` on table `Survey` required. This step will fail if there are existing NULL values in that column.
  - Made the column `artist` on table `Survey` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `user_id` on the `Survey` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `userId` to the `Survey_Participants` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `userId` on the `User_Oauth` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Survey" DROP CONSTRAINT "Survey_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Survey_Participants" DROP CONSTRAINT "Survey_Participants_user_id_fkey";

-- DropForeignKey
ALTER TABLE "User_Oauth" DROP CONSTRAINT "User_Oauth_userId_fkey";

-- AlterTable
ALTER TABLE "Survey" ADD COLUMN     "genre" "Genre" NOT NULL,
ALTER COLUMN "music_title" SET NOT NULL,
ALTER COLUMN "artist" SET NOT NULL,
DROP COLUMN "user_id",
ADD COLUMN     "user_id" INTEGER NOT NULL,
ALTER COLUMN "reward_amount" DROP NOT NULL,
ALTER COLUMN "reward" DROP NOT NULL,
ALTER COLUMN "expert_reward" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Survey_Participants" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Survey_Result" DROP COLUMN "version";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User_Oauth" DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "User_Oauth" ADD CONSTRAINT "User_Oauth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Survey_Participants" ADD CONSTRAINT "Survey_Participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
