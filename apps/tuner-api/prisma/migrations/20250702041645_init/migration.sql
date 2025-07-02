/*
  Warnings:

  - You are about to drop the column `survey_id` on the `Survey_Question` table. All the data in the column will be lost.
  - Added the required column `questions` to the `Survey` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Survey_Question" DROP CONSTRAINT "Survey_Question_survey_id_fkey";

-- AlterTable
ALTER TABLE "Survey" ADD COLUMN     "questions" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Survey_Question" DROP COLUMN "survey_id";
