/*
  Warnings:

  - A unique constraint covering the columns `[noteId,userId]` on the table `NoteAccess` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "NoteAccess_noteId_userId_key" ON "NoteAccess"("noteId", "userId");
