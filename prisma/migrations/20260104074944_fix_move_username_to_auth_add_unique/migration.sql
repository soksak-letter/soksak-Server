/*
  Warnings:

  - You are about to drop the column `username` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `auth` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `auth` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `auth` ADD COLUMN `username` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `username`;

-- CreateIndex
CREATE UNIQUE INDEX `auth_username_key` ON `auth`(`username`);

-- CreateIndex
CREATE UNIQUE INDEX `auth_email_key` ON `auth`(`email`);
