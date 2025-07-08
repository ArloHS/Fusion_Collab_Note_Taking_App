/*
  Warnings:

  - You are about to drop the column `userId` on the `Category` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `Category` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `title` on the `Note` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(75)`.
  - You are about to alter the column `email` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `username` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `password` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `firstName` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `lastName` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - Made the column `firstName` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastName` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_userId_fkey";

-- DropIndex
DROP INDEX "NoteAccess_noteId_userId_key";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "userId",
ALTER COLUMN "name" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "Note" ALTER COLUMN "title" SET DATA TYPE VARCHAR(75);

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "email" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "username" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "firstName" SET NOT NULL,
ALTER COLUMN "firstName" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "lastName" SET NOT NULL,
ALTER COLUMN "lastName" SET DATA TYPE VARCHAR(50);
