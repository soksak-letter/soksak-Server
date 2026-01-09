/*
  Warnings:

  - Added the required column `asset_url` to the `letter_asset_font` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `letter_asset_font` ADD COLUMN `asset_url` VARCHAR(191) NOT NULL;
