/*
  Warnings:

  - A unique constraint covering the columns `[eventId,email]` on the table `attendees` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "attendees_eventId_email_key" ON "attendees"("eventId", "email");
