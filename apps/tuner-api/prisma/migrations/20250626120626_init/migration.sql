/*
  Warnings:

  - Added the required column `template_id` to the `Survey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Survey" ADD COLUMN     "template_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "Survey_Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
