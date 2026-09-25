ALTER TABLE "User" ADD COLUMN "membershipPence" INTEGER;
ALTER TABLE "ReadinessCheckin" ADD COLUMN "glucoseMmol" DOUBLE PRECISION;
ALTER TABLE "ReadinessCheckin" ADD COLUMN "glucoseContext" TEXT;
CREATE TABLE "ActivityLog" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "kind" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "date" TEXT NOT NULL,
  "minutes" INTEGER NOT NULL,
  "atGym" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "ActivityLog_userId_date_idx" ON "ActivityLog"("userId", "date");
