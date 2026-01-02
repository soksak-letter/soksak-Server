/*
  Warnings:

  - A unique constraint covering the columns `[phone_number]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `auth` MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `user` ADD COLUMN `name` VARCHAR(191) NULL,
    ADD COLUMN `phone_number` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `user_phone_number_key` ON `user`(`phone_number`);
