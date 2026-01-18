/*
  Warnings:

  - You are about to drop the column `reply_enabled` on the `user_notification_setting` table. All the data in the column will be lost.
  - You are about to drop the column `weekly_report_enabled` on the `user_notification_setting` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user_notification_setting` DROP COLUMN `reply_enabled`,
    DROP COLUMN `weekly_report_enabled`,
    MODIFY `letter_enabled` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `marketing_enabled` BOOLEAN NOT NULL DEFAULT false;
