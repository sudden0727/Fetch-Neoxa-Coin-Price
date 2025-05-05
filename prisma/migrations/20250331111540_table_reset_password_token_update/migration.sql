/*
  Warnings:

  - You are about to drop the column `resetPasswrdToken` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[resetPasswordToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_resetPasswrdToken_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "resetPasswrdToken",
ADD COLUMN     "resetPasswordToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_resetPasswordToken_key" ON "User"("resetPasswordToken");
