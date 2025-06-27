/*
  Warnings:

  - Added the required column `template_id` to the `Survey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "QuestionType" ADD VALUE 'ranking';
ALTER TYPE "QuestionType" ADD VALUE 'likert';

-- AlterTable
ALTER TABLE "Survey" ADD COLUMN     "template_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "Survey_Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
