/*
  Warnings:

  - A unique constraint covering the columns `[pollId,userId]` on the table `PollVote` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PollVote_pollId_userId_key" ON "public"."PollVote"("pollId", "userId");
