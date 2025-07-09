-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('superadmin', 'admin', 'ordinary', 'expert');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female');

-- CreateEnum
CREATE TYPE "AgeGroup" AS ENUM ('teen', 'twenties', 'thirties', 'forties', 'fifties', 'sixties');

-- CreateEnum
CREATE TYPE "Genre" AS ENUM ('hiphop', 'ballad', 'dance', 'rnb', 'rock', 'trot', 'pop', 'gukak', 'ccm', 'edm', 'classical', 'jazz');

-- CreateEnum
CREATE TYPE "OAuthProvider" AS ENUM ('kakao', 'google');

-- CreateEnum
CREATE TYPE "SurveyType" AS ENUM ('general', 'official');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('fixed', 'custom');

-- CreateEnum
CREATE TYPE "SurveyActive" AS ENUM ('upcoming', 'ongoing', 'closed');

-- CreateEnum
CREATE TYPE "SurveyStatus" AS ENUM ('draft', 'complete');

-- CreateEnum
CREATE TYPE "EndedBy" AS ENUM ('expired', 'outOfRewards', 'closedByCreator');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAW');

-- CreateEnum
CREATE TYPE "WithdrawalStatus" AS ENUM ('pending', 'completed', 'failed');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "gender" BOOLEAN,
    "age" "AgeGroup",
    "genre" "Genre",
    "job_domain" BOOLEAN,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "wallet_address" TEXT,
    "simple_password" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'ordinary',
    "badge_issued_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User_Oauth" (
    "id" SERIAL NOT NULL,
    "provider_id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profile_image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "User_Oauth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Survey" (
    "id" SERIAL NOT NULL,
    "survey_title" TEXT NOT NULL,
    "music_title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "music_uri" TEXT NOT NULL,
    "thumbnail_uri" TEXT NOT NULL,
    "is_released" BOOLEAN NOT NULL,
    "released_date" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "type" "SurveyType" NOT NULL,
    "genre" "Genre" NOT NULL,
    "start_at" TIMESTAMP(3) NOT NULL,
    "end_at" TIMESTAMP(3) NOT NULL,
    "reward_amount" INTEGER,
    "reward" INTEGER,
    "expert_reward" INTEGER,
    "is_active" "SurveyActive" NOT NULL,
    "ended_by" "EndedBy",
    "status" "SurveyStatus" NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "questions" INTEGER NOT NULL,
    "survey_question" JSONB,

    CONSTRAINT "Survey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Survey_Question" (
    "id" SERIAL NOT NULL,
    "question_type" "QuestionType" NOT NULL,
    "question" JSONB NOT NULL,
    "question_order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Survey_Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Survey_Participants" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "survey_id" INTEGER NOT NULL,
    "answers" JSONB NOT NULL,
    "status" "SurveyStatus" NOT NULL DEFAULT 'draft',
    "rewarded" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Survey_Participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Survey_Result" (
    "id" SERIAL NOT NULL,
    "survey_id" INTEGER NOT NULL,
    "survey_statistics" JSONB NOT NULL,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "metadata_ipfs" TEXT,
    "respondents" INTEGER NOT NULL,
    "reward_claimed_amount" INTEGER NOT NULL,
    "reward_claimed" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Survey_Result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "memo" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WithdrawalRequest" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "txhash" TEXT NOT NULL,
    "status" "WithdrawalStatus" NOT NULL DEFAULT 'pending',
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WithdrawalRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TunerContract" (
    "id" SERIAL NOT NULL,
    "ca_token" TEXT,
    "ca_badge" TEXT,
    "ca_survey" TEXT,
    "ca_transac" TEXT,
    "abi_survey" JSONB,
    "abi_badge" JSONB,
    "abi_transac" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TunerContract_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_Oauth_provider_id_key" ON "User_Oauth"("provider_id");

-- CreateIndex
CREATE UNIQUE INDEX "Survey_Result_survey_id_key" ON "Survey_Result"("survey_id");

-- AddForeignKey
ALTER TABLE "User_Oauth" ADD CONSTRAINT "User_Oauth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Survey_Participants" ADD CONSTRAINT "Survey_Participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Survey_Participants" ADD CONSTRAINT "Survey_Participants_survey_id_fkey" FOREIGN KEY ("survey_id") REFERENCES "Survey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Survey_Result" ADD CONSTRAINT "Survey_Result_survey_id_fkey" FOREIGN KEY ("survey_id") REFERENCES "Survey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WithdrawalRequest" ADD CONSTRAINT "WithdrawalRequest_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
