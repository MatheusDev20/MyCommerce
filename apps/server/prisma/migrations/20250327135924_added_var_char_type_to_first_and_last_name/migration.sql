/*
  Warnings:

  - You are about to alter the column `firstName` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(40)`.
  - You are about to alter the column `lastName` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(40)`.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "firstName" SET DATA TYPE VARCHAR(40),
ALTER COLUMN "lastName" SET DATA TYPE VARCHAR(40);
