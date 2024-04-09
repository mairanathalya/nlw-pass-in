-- CreateTable
CREATE TABLE "check-ins" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attendee_id" INTEGER NOT NULL,
    CONSTRAINT "check-ins_attendee_id_fkey" FOREIGN KEY ("attendee_id") REFERENCES "attendees" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "check-ins_attendee_id_key" ON "check-ins"("attendee_id");
