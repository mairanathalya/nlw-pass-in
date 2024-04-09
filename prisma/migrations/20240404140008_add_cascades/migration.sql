-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_check-ins" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attendee_id" INTEGER NOT NULL,
    CONSTRAINT "check-ins_attendee_id_fkey" FOREIGN KEY ("attendee_id") REFERENCES "attendees" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_check-ins" ("attendee_id", "created_at", "id") SELECT "attendee_id", "created_at", "id" FROM "check-ins";
DROP TABLE "check-ins";
ALTER TABLE "new_check-ins" RENAME TO "check-ins";
CREATE UNIQUE INDEX "check-ins_attendee_id_key" ON "check-ins"("attendee_id");
CREATE TABLE "new_attendees" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventId" TEXT NOT NULL,
    CONSTRAINT "attendees_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_attendees" ("created_at", "email", "eventId", "id", "name") SELECT "created_at", "email", "eventId", "id", "name" FROM "attendees";
DROP TABLE "attendees";
ALTER TABLE "new_attendees" RENAME TO "attendees";
CREATE UNIQUE INDEX "attendees_eventId_email_key" ON "attendees"("eventId", "email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
