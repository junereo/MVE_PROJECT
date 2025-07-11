/*
  Warnings:

  - Added the required column `message` to the `WithdrawalRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `signature` to the `WithdrawalRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WithdrawalRequest" ADD COLUMN     "message" TEXT NOT NULL,
ADD COLUMN     "signature" TEXT NOT NULL;
