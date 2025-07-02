/*
  Warnings:

  - Added the required column `thumbnail_uri` to the `Survey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Survey" ADD COLUMN     "thumbnail_uri" TEXT NOT NULL;
