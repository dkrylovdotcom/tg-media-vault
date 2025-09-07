-- CreateTable
CREATE TABLE "Content" (
    "id" SERIAL NOT NULL,
    "offset" INT NOT NULL,
    "channelId" BIGINT NOT NULL,
    "userId" BIGINT NOT NULL,
    "messageId" BIGINT NOT NULL,
    "filePath" TEXT,
    "status" TEXT NOT NULL,
    "statusMessage" TEXT,
    "downloadedAt" TIMESTAMP(3),
    "channelMessage" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_pk" PRIMARY KEY ("id")
);
