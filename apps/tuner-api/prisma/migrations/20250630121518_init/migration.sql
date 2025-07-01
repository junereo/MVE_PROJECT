-- CreateEnum
CREATE TYPE "UserLevel" AS ENUM ('Regular', 'Expert');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female');

-- CreateEnum
CREATE TYPE "AgeGroup" AS ENUM ('teen', 'twenties', 'thirties', 'forties', 'fifties', 'sixties');

-- CreateEnum
CREATE TYPE "Genre" AS ENUM ('dance', 'ballad', 'trot', 'pop', 'gukak', 'ccm');

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('admin', 'superadmin');

-- CreateEnum
CREATE TYPE "OAuthProvider" AS ENUM ('kakao', 'google');

-- CreateEnum
CREATE TYPE "SurveyType" AS ENUM ('general', 'official');

-- CreateEnum
CREATE TYPE "SurveyTags" AS ENUM ('감각적인', '화려한', '감성적인', '몽환적인', '트렌디한', '복고풍', '중독성있는', '잔잔한', '역동적인', '독창적인');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('subjective', 'multiple_choice', 'check_box', 'ranking', 'likert');

-- CreateEnum
CREATE TYPE "SurveyActive" AS ENUM ('upcoming', 'ongoing', 'closed');

-- CreateEnum
CREATE TYPE "SurveyStatus" AS ENUM ('draft', 'complete');

-- CreateEnum
CREATE TYPE "EndedBy" AS ENUM ('expired', 'outOfRewards', 'closedByCreator');

-- CreateEnum
CREATE TYPE "RewardStatus" AS ENUM ('pending', 'completed', 'failed');

-- CreateEnum
CREATE TYPE "RewardType" AS ENUM ('normal', 'expert');

-- CreateEnum
CREATE TYPE "SbtType" AS ENUM ('badge', 'token');

-- CreateEnum
CREATE TYPE "SbtCondition" AS ENUM ('auto', 'manual');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "gender" "Gender",
    "ageGroup" "AgeGroup",
    "genre" "Genre",
    "wallet_address" TEXT,
    "simple_password" TEXT,
    "level" "UserLevel" NOT NULL DEFAULT 'Regular',
    "badge_issued_at" TIMESTAMP(3),
    "balance" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User_OAuth" (
    "id" SERIAL NOT NULL,
    "provider" "OAuthProvider" NOT NULL,
    "provider_id" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profile_image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "User_OAuth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User_Balance" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "current_reward" INTEGER NOT NULL,
    "total_withdrawn" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_Balance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Survey" (
    "id" SERIAL NOT NULL,
    "template_id" INTEGER NOT NULL,
    "survey_title" TEXT NOT NULL,
    "create_userId" TEXT,
    "create_adminId" TEXT,
    "music_id" INTEGER NOT NULL,
    "type" "SurveyType" NOT NULL,
    "tags" "SurveyTags"[],
    "music_sample_url" TEXT,
    "start_at" TIMESTAMP(3) NOT NULL,
    "end_at" TIMESTAMP(3) NOT NULL,
    "reward_amount" INTEGER,
    "reward" INTEGER,
    "expert_reward" INTEGER,
    "is_active" "SurveyActive" NOT NULL,
    "ended_by" "EndedBy",
    "metadata_cid" TEXT,
    "status" "SurveyStatus" NOT NULL DEFAULT 'draft',
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Survey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Survey_Responses" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "survey_id" INTEGER NOT NULL,
    "answers" JSONB NOT NULL,
    "status" "SurveyStatus" NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "rewarded" BOOLEAN NOT NULL,

    CONSTRAINT "Survey_Responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Survey_Template" (
    "id" SERIAL NOT NULL,
    "template_name" TEXT NOT NULL,
    "template" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Survey_Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Survey_Custom" (
    "id" SERIAL NOT NULL,
    "survey_id" INTEGER NOT NULL,
    "question_text" TEXT NOT NULL,
    "question_type" "QuestionType" NOT NULL,
    "options" JSONB,
    "is_required" BOOLEAN NOT NULL DEFAULT true,
    "question_order" INTEGER NOT NULL,

    CONSTRAINT "Survey_Custom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Survey_Result" (
    "id" SERIAL NOT NULL,
    "survey_id" INTEGER NOT NULL,
    "survey_statistics" JSONB NOT NULL,
    "is_public" BOOLEAN NOT NULL,
    "generated_at" TIMESTAMP(3) NOT NULL,
    "version" INTEGER,
    "metadata" JSONB,
    "respondents" INTEGER NOT NULL,
    "reward_claimed_amount" INTEGER NOT NULL,
    "reward_claimed" INTEGER NOT NULL,

    CONSTRAINT "Survey_Result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Music" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "agency" TEXT NOT NULL,
    "release_date" TIMESTAMP(3),
    "is_released" BOOLEAN NOT NULL,
    "thumbnail_url" TEXT NOT NULL,
    "sample_url" TEXT NOT NULL,
    "nft_token_id" TEXT NOT NULL,

    CONSTRAINT "Music_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rewards" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "survey_id" INTEGER NOT NULL,
    "token_amount" INTEGER NOT NULL,
    "status" "RewardStatus" NOT NULL,
    "reward_reason" TEXT NOT NULL,
    "source_ref" TEXT NOT NULL,
    "reward_type" "RewardType" NOT NULL,
    "rewarded_at" TIMESTAMP(3) NOT NULL,
    "adminId" TEXT,

    CONSTRAINT "Rewards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Withdrawal_Requests" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "total_token_amount" INTEGER NOT NULL,
    "requested_at" TIMESTAMP(3) NOT NULL,
    "processed_at" TIMESTAMP(3),
    "tx_hash" TEXT NOT NULL,
    "status" "RewardStatus" NOT NULL,
    "admin_id" TEXT,

    CONSTRAINT "Withdrawal_Requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SBT_Issuance" (
    "id" SERIAL NOT NULL,
    "admin_id" TEXT NOT NULL,
    "sbt_type" "SbtType" NOT NULL,
    "name" TEXT NOT NULL,
    "amount" INTEGER,
    "issued_at" TIMESTAMP(3) NOT NULL,
    "condition_note" "SbtCondition" NOT NULL,
    "metadata_cid" TEXT,
    "token_id" TEXT,
    "chain_tx_hash" TEXT,

    CONSTRAINT "SBT_Issuance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_OAuth_provider_id_key" ON "User_OAuth"("provider_id");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Survey_Result_survey_id_key" ON "Survey_Result"("survey_id");

-- AddForeignKey
ALTER TABLE "User_OAuth" ADD CONSTRAINT "User_OAuth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Balance" ADD CONSTRAINT "User_Balance_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_create_userId_fkey" FOREIGN KEY ("create_userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_create_adminId_fkey" FOREIGN KEY ("create_adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_music_id_fkey" FOREIGN KEY ("music_id") REFERENCES "Music"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "Survey_Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Survey_Responses" ADD CONSTRAINT "Survey_Responses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Survey_Responses" ADD CONSTRAINT "Survey_Responses_survey_id_fkey" FOREIGN KEY ("survey_id") REFERENCES "Survey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Survey_Custom" ADD CONSTRAINT "Survey_Custom_survey_id_fkey" FOREIGN KEY ("survey_id") REFERENCES "Survey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Survey_Result" ADD CONSTRAINT "Survey_Result_survey_id_fkey" FOREIGN KEY ("survey_id") REFERENCES "Survey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rewards" ADD CONSTRAINT "Rewards_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rewards" ADD CONSTRAINT "Rewards_survey_id_fkey" FOREIGN KEY ("survey_id") REFERENCES "Survey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rewards" ADD CONSTRAINT "Rewards_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Withdrawal_Requests" ADD CONSTRAINT "Withdrawal_Requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Withdrawal_Requests" ADD CONSTRAINT "Withdrawal_Requests_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SBT_Issuance" ADD CONSTRAINT "SBT_Issuance_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
