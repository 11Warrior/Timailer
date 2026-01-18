-- CreateTable
CREATE TABLE "Email" (
    "id" TEXT NOT NULL,
    "senderEmail" TEXT NOT NULL,
    "receiverEmail" TEXT[],
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Email_pkey" PRIMARY KEY ("id")
);
