/*
  Warnings:

  - You are about to drop the column `billingAddressId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `shippingAddressId` on the `users` table. All the data in the column will be lost.
  - Added the required column `type` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `addresses` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('BILLING', 'SHIPPING');

-- DropForeignKey
ALTER TABLE "public"."users" DROP CONSTRAINT "users_billingAddressId_fkey";

-- DropForeignKey
ALTER TABLE "public"."users" DROP CONSTRAINT "users_shippingAddressId_fkey";

-- DropIndex
DROP INDEX "public"."users_billingAddressId_key";

-- DropIndex
DROP INDEX "public"."users_shippingAddressId_key";

-- AlterTable
ALTER TABLE "addresses" ADD COLUMN     "type" "AddressType" NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "billingAddressId",
DROP COLUMN "shippingAddressId";

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
