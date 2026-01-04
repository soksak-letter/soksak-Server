/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `auth` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `auth` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `auth` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `auth` DROP FOREIGN KEY `auth_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `block` DROP FOREIGN KEY `block_blocked_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `block` DROP FOREIGN KEY `block_blocker_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `friend` DROP FOREIGN KEY `friend_user_a_id_fkey`;

-- DropForeignKey
ALTER TABLE `friend` DROP FOREIGN KEY `friend_user_b_id_fkey`;

-- DropForeignKey
ALTER TABLE `friend_request` DROP FOREIGN KEY `friend_request_receiver_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `friend_request` DROP FOREIGN KEY `friend_request_requester_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `inquiry` DROP FOREIGN KEY `inquiry_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `letter` DROP FOREIGN KEY `letter_receiver_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `letter` DROP FOREIGN KEY `letter_sender_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `letter_ai_keyword` DROP FOREIGN KEY `letter_ai_keyword_letter_id_fkey`;

-- DropForeignKey
ALTER TABLE `letter_design` DROP FOREIGN KEY `letter_design_letter_id_fkey`;

-- DropForeignKey
ALTER TABLE `letter_emotion_tag` DROP FOREIGN KEY `letter_emotion_tag_letter_id_fkey`;

-- DropForeignKey
ALTER TABLE `letter_like` DROP FOREIGN KEY `letter_like_letter_id_fkey`;

-- DropForeignKey
ALTER TABLE `letter_like` DROP FOREIGN KEY `letter_like_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `refresh_token` DROP FOREIGN KEY `refresh_token_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `restriction` DROP FOREIGN KEY `restriction_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `session_participant` DROP FOREIGN KEY `session_participant_session_id_fkey`;

-- DropForeignKey
ALTER TABLE `session_participant` DROP FOREIGN KEY `session_participant_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `session_review` DROP FOREIGN KEY `session_review_reviewer_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `session_review` DROP FOREIGN KEY `session_review_session_id_fkey`;

-- DropForeignKey
ALTER TABLE `session_review` DROP FOREIGN KEY `session_review_target_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_agreement` DROP FOREIGN KEY `user_agreement_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_device_token` DROP FOREIGN KEY `user_device_token_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_interest` DROP FOREIGN KEY `user_interest_interest_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_interest` DROP FOREIGN KEY `user_interest_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_notification_setting` DROP FOREIGN KEY `user_notification_setting_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_report` DROP FOREIGN KEY `user_report_letter_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_report` DROP FOREIGN KEY `user_report_reporter_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_report` DROP FOREIGN KEY `user_report_target_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_report_reason` DROP FOREIGN KEY `user_report_reason_report_id_fkey`;

-- DropForeignKey
ALTER TABLE `weekly_report` DROP FOREIGN KEY `weekly_report_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `weekly_report_emotion` DROP FOREIGN KEY `weekly_report_emotion_report_id_fkey`;

-- DropForeignKey
ALTER TABLE `weekly_report_highlight_letter` DROP FOREIGN KEY `weekly_report_highlight_letter_letter_id_fkey`;

-- DropForeignKey
ALTER TABLE `weekly_report_highlight_letter` DROP FOREIGN KEY `weekly_report_highlight_letter_report_id_fkey`;

-- DropForeignKey
ALTER TABLE `weekly_report_keyword` DROP FOREIGN KEY `weekly_report_keyword_report_id_fkey`;

-- AlterTable
ALTER TABLE `auth` ADD COLUMN `username` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `friend_request` MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `notice` MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `policy_document` MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `user_notification_setting` MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX `auth_user_id_key` ON `auth`(`user_id`);

-- CreateIndex
CREATE UNIQUE INDEX `auth_username_key` ON `auth`(`username`);

-- CreateIndex
CREATE UNIQUE INDEX `auth_email_key` ON `auth`(`email`);

-- AddForeignKey
ALTER TABLE `user_notification_setting` ADD CONSTRAINT `user_notification_setting_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_device_token` ADD CONSTRAINT `user_device_token_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_agreement` ADD CONSTRAINT `user_agreement_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `auth` ADD CONSTRAINT `auth_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refresh_token` ADD CONSTRAINT `refresh_token_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `letter` ADD CONSTRAINT `letter_sender_user_id_fkey` FOREIGN KEY (`sender_user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `letter` ADD CONSTRAINT `letter_receiver_user_id_fkey` FOREIGN KEY (`receiver_user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `letter_design` ADD CONSTRAINT `letter_design_letter_id_fkey` FOREIGN KEY (`letter_id`) REFERENCES `letter`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `letter_emotion_tag` ADD CONSTRAINT `letter_emotion_tag_letter_id_fkey` FOREIGN KEY (`letter_id`) REFERENCES `letter`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `letter_ai_keyword` ADD CONSTRAINT `letter_ai_keyword_letter_id_fkey` FOREIGN KEY (`letter_id`) REFERENCES `letter`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `letter_like` ADD CONSTRAINT `letter_like_letter_id_fkey` FOREIGN KEY (`letter_id`) REFERENCES `letter`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `letter_like` ADD CONSTRAINT `letter_like_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `friend_request` ADD CONSTRAINT `friend_request_requester_user_id_fkey` FOREIGN KEY (`requester_user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `friend_request` ADD CONSTRAINT `friend_request_receiver_user_id_fkey` FOREIGN KEY (`receiver_user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `friend` ADD CONSTRAINT `friend_user_a_id_fkey` FOREIGN KEY (`user_a_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `friend` ADD CONSTRAINT `friend_user_b_id_fkey` FOREIGN KEY (`user_b_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `block` ADD CONSTRAINT `block_blocker_user_id_fkey` FOREIGN KEY (`blocker_user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `block` ADD CONSTRAINT `block_blocked_user_id_fkey` FOREIGN KEY (`blocked_user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_report` ADD CONSTRAINT `user_report_reporter_user_id_fkey` FOREIGN KEY (`reporter_user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_report` ADD CONSTRAINT `user_report_target_user_id_fkey` FOREIGN KEY (`target_user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_report` ADD CONSTRAINT `user_report_letter_id_fkey` FOREIGN KEY (`letter_id`) REFERENCES `letter`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_report_reason` ADD CONSTRAINT `user_report_reason_report_id_fkey` FOREIGN KEY (`report_id`) REFERENCES `user_report`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `weekly_report` ADD CONSTRAINT `weekly_report_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `weekly_report_emotion` ADD CONSTRAINT `weekly_report_emotion_report_id_fkey` FOREIGN KEY (`report_id`) REFERENCES `weekly_report`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `weekly_report_keyword` ADD CONSTRAINT `weekly_report_keyword_report_id_fkey` FOREIGN KEY (`report_id`) REFERENCES `weekly_report`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `weekly_report_highlight_letter` ADD CONSTRAINT `weekly_report_highlight_letter_report_id_fkey` FOREIGN KEY (`report_id`) REFERENCES `weekly_report`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `weekly_report_highlight_letter` ADD CONSTRAINT `weekly_report_highlight_letter_letter_id_fkey` FOREIGN KEY (`letter_id`) REFERENCES `letter`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_interest` ADD CONSTRAINT `user_interest_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_interest` ADD CONSTRAINT `user_interest_interest_id_fkey` FOREIGN KEY (`interest_id`) REFERENCES `interest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `session_participant` ADD CONSTRAINT `session_participant_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `matching_session`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `session_participant` ADD CONSTRAINT `session_participant_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `session_review` ADD CONSTRAINT `session_review_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `matching_session`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `session_review` ADD CONSTRAINT `session_review_reviewer_user_id_fkey` FOREIGN KEY (`reviewer_user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `session_review` ADD CONSTRAINT `session_review_target_user_id_fkey` FOREIGN KEY (`target_user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inquiry` ADD CONSTRAINT `inquiry_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `restriction` ADD CONSTRAINT `restriction_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
