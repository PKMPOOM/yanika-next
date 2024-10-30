-- CreateEnum
CREATE TYPE "Grades" AS ENUM ('grade_1', 'grade_2', 'grade_3', 'grade_4', 'grade_5', 'grade_6', 'grade_7', 'grade_8', 'grade_9', 'grade_10', 'grade_11', 'grade_12', 'university');

-- CreateTable
CREATE TABLE "Subject" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "description" TEXT,
    "image_url" TEXT,
    "course_outline" TEXT,
    "group_price" INTEGER,
    "single_price" INTEGER,
    "grade" "Grades" NOT NULL DEFAULT 'grade_1',

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Classes" (
    "id" TEXT NOT NULL,
    "notify" BOOLEAN NOT NULL DEFAULT false,
    "is_paid" BOOLEAN NOT NULL DEFAULT false,
    "payment_slip_url" TEXT,
    "meeting_time" TIMESTAMP(3),
    "meeting_link" TEXT,
    "userId" TEXT,
    "subjectId" TEXT NOT NULL,

    CONSTRAINT "Classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SubjectToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "Subject_id_idx" ON "Subject"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Classes_id_key" ON "Classes"("id");

-- CreateIndex
CREATE INDEX "Classes_id_idx" ON "Classes"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_SubjectToTag_AB_unique" ON "_SubjectToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_SubjectToTag_B_index" ON "_SubjectToTag"("B");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Classes" ADD CONSTRAINT "Classes_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Classes" ADD CONSTRAINT "Classes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubjectToTag" ADD CONSTRAINT "_SubjectToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubjectToTag" ADD CONSTRAINT "_SubjectToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
