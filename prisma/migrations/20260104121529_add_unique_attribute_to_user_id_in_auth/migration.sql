/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `auth` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `auth_user_id_key` ON `auth`(`user_id`);
