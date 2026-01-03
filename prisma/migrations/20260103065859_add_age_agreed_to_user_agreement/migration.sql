/*
  Warnings:

  - Added the required column `age_over_14_agreed` to the `user_agreement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user_agreement` ADD COLUMN `age_over_14_agreed` BOOLEAN NOT NULL;
