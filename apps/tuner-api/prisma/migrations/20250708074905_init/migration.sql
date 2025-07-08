-- AlterTable
ALTER TABLE "TunerContract" ADD COLUMN     "abi_badge" JSONB;

-- AlterTable
ALTER TABLE "WithdrawalRequest" ALTER COLUMN "status" SET DEFAULT 'pending';
