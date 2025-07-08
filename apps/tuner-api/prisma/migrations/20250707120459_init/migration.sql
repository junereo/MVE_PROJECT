-- CreateTable
CREATE TABLE "TunerContract" (
    "id" SERIAL NOT NULL,
    "ca_token" TEXT,
    "ca_badge" TEXT,
    "ca_survey" TEXT,
    "ca_transac" TEXT,
    "abi_survey" JSONB,
    "abi_transac" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TunerContract_pkey" PRIMARY KEY ("id")
);
