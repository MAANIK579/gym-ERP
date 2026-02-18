-- CreateTable
CREATE TABLE "MemberSchedule" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'Personal',
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurringDays" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "memberId" INTEGER NOT NULL,

    CONSTRAINT "MemberSchedule_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MemberSchedule" ADD CONSTRAINT "MemberSchedule_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
