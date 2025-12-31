/*
  Warnings:

  - The primary key for the `auth` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `auth` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `user_id` on the `auth` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `block` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `blocker_user_id` on the `block` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `blocked_user_id` on the `block` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `friend` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `friend` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `user_a_id` on the `friend` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `user_b_id` on the `friend` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `requester_user_id` on the `friend_request` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `receiver_user_id` on the `friend_request` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `inquiry` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `inquiry` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `user_id` on the `inquiry` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `letter` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `letter` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `sender_user_id` on the `letter` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `receiver_user_id` on the `letter` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `letter_ai_keyword` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `letter_id` on the `letter_ai_keyword` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `letter_design` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `letter_id` on the `letter_design` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `letter_emotion_tag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `letter_id` on the `letter_emotion_tag` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `letter_like` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `letter_id` on the `letter_like` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `user_id` on the `letter_like` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `notice` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `notice` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `refresh_token` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `refresh_token` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `user_id` on the `refresh_token` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `restriction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `restriction` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `user_id` on the `restriction` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `session_participant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `user_id` on the `session_participant` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `session_review` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `session_review` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `reviewer_user_id` on the `session_review` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `target_user_id` on the `session_review` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `user` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `user_agreement` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `user_agreement` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `user_id` on the `user_agreement` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `user_device_token` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `user_device_token` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `user_id` on the `user_device_token` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `user_interest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `user_id` on the `user_interest` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `user_notification_setting` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `user_id` on the `user_notification_setting` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `user_report` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `user_report` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `reporter_user_id` on the `user_report` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `target_user_id` on the `user_report` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `letter_id` on the `user_report` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `user_report_reason` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `report_id` on the `user_report_reason` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `weekly_report` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `weekly_report` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `user_id` on the `weekly_report` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `weekly_report_emotion` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `report_id` on the `weekly_report_emotion` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `weekly_report_highlight_letter` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `report_id` on the `weekly_report_highlight_letter` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `letter_id` on the `weekly_report_highlight_letter` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `weekly_report_keyword` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `report_id` on the `weekly_report_keyword` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

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
ALTER TABLE `session_participant` DROP FOREIGN KEY `session_participant_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `session_review` DROP FOREIGN KEY `session_review_reviewer_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `session_review` DROP FOREIGN KEY `session_review_target_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_agreement` DROP FOREIGN KEY `user_agreement_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_device_token` DROP FOREIGN KEY `user_device_token_user_id_fkey`;

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

-- DropIndex
DROP INDEX `user_nickname_key` ON `user`;

-- AlterTable
ALTER TABLE `auth` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `user_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `block` DROP PRIMARY KEY,
    MODIFY `blocker_user_id` INTEGER NOT NULL,
    MODIFY `blocked_user_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`blocker_user_id`, `blocked_user_id`);

-- AlterTable
ALTER TABLE `friend` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `user_a_id` INTEGER NOT NULL,
    MODIFY `user_b_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `friend_request` MODIFY `requester_user_id` INTEGER NOT NULL,
    MODIFY `receiver_user_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `inquiry` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `user_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `letter` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `sender_user_id` INTEGER NOT NULL,
    MODIFY `receiver_user_id` INTEGER NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `letter_ai_keyword` DROP PRIMARY KEY,
    MODIFY `letter_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`letter_id`, `keyword_id`);

-- AlterTable
ALTER TABLE `letter_design` DROP PRIMARY KEY,
    MODIFY `letter_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`letter_id`);

-- AlterTable
ALTER TABLE `letter_emotion_tag` DROP PRIMARY KEY,
    MODIFY `letter_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`letter_id`, `tag`);

-- AlterTable
ALTER TABLE `letter_like` DROP PRIMARY KEY,
    MODIFY `letter_id` INTEGER NOT NULL,
    MODIFY `user_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`letter_id`, `user_id`);

-- AlterTable
ALTER TABLE `notice` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `refresh_token` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `user_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `restriction` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `user_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `session_participant` DROP PRIMARY KEY,
    MODIFY `user_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`session_id`, `user_id`);

-- AlterTable
ALTER TABLE `session_review` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `reviewer_user_id` INTEGER NOT NULL,
    MODIFY `target_user_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `nickname` VARCHAR(191) NULL,
    MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `user_agreement` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `user_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `user_device_token` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `user_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `user_interest` DROP PRIMARY KEY,
    MODIFY `user_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`user_id`, `interest_id`);

-- AlterTable
ALTER TABLE `user_notification_setting` DROP PRIMARY KEY,
    MODIFY `user_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`user_id`);

-- AlterTable
ALTER TABLE `user_report` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `reporter_user_id` INTEGER NOT NULL,
    MODIFY `target_user_id` INTEGER NOT NULL,
    MODIFY `letter_id` INTEGER NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `user_report_reason` DROP PRIMARY KEY,
    MODIFY `report_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`report_id`, `reason`);

-- AlterTable
ALTER TABLE `weekly_report` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `user_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `weekly_report_emotion` DROP PRIMARY KEY,
    MODIFY `report_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`report_id`, `emotion`);

-- AlterTable
ALTER TABLE `weekly_report_highlight_letter` DROP PRIMARY KEY,
    MODIFY `report_id` INTEGER NOT NULL,
    MODIFY `letter_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`report_id`, `letter_id`);

-- AlterTable
ALTER TABLE `weekly_report_keyword` DROP PRIMARY KEY,
    MODIFY `report_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`report_id`, `keyword`);

-- AddForeignKey
ALTER TABLE `user_notification_setting` ADD CONSTRAINT `user_notification_setting_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_device_token` ADD CONSTRAINT `user_device_token_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_agreement` ADD CONSTRAINT `user_agreement_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `auth` ADD CONSTRAINT `auth_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refresh_token` ADD CONSTRAINT `refresh_token_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_interest` ADD CONSTRAINT `user_interest_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `session_participant` ADD CONSTRAINT `session_participant_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `session_review` ADD CONSTRAINT `session_review_reviewer_user_id_fkey` FOREIGN KEY (`reviewer_user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `session_review` ADD CONSTRAINT `session_review_target_user_id_fkey` FOREIGN KEY (`target_user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `letter` ADD CONSTRAINT `letter_sender_user_id_fkey` FOREIGN KEY (`sender_user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `letter` ADD CONSTRAINT `letter_receiver_user_id_fkey` FOREIGN KEY (`receiver_user_id`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `letter_design` ADD CONSTRAINT `letter_design_letter_id_fkey` FOREIGN KEY (`letter_id`) REFERENCES `letter`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `letter_emotion_tag` ADD CONSTRAINT `letter_emotion_tag_letter_id_fkey` FOREIGN KEY (`letter_id`) REFERENCES `letter`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `letter_ai_keyword` ADD CONSTRAINT `letter_ai_keyword_letter_id_fkey` FOREIGN KEY (`letter_id`) REFERENCES `letter`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `letter_like` ADD CONSTRAINT `letter_like_letter_id_fkey` FOREIGN KEY (`letter_id`) REFERENCES `letter`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `letter_like` ADD CONSTRAINT `letter_like_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `friend_request` ADD CONSTRAINT `friend_request_requester_user_id_fkey` FOREIGN KEY (`requester_user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `friend_request` ADD CONSTRAINT `friend_request_receiver_user_id_fkey` FOREIGN KEY (`receiver_user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `friend` ADD CONSTRAINT `friend_user_a_id_fkey` FOREIGN KEY (`user_a_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `friend` ADD CONSTRAINT `friend_user_b_id_fkey` FOREIGN KEY (`user_b_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `block` ADD CONSTRAINT `block_blocker_user_id_fkey` FOREIGN KEY (`blocker_user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `block` ADD CONSTRAINT `block_blocked_user_id_fkey` FOREIGN KEY (`blocked_user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_report` ADD CONSTRAINT `user_report_reporter_user_id_fkey` FOREIGN KEY (`reporter_user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_report` ADD CONSTRAINT `user_report_target_user_id_fkey` FOREIGN KEY (`target_user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_report` ADD CONSTRAINT `user_report_letter_id_fkey` FOREIGN KEY (`letter_id`) REFERENCES `letter`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_report_reason` ADD CONSTRAINT `user_report_reason_report_id_fkey` FOREIGN KEY (`report_id`) REFERENCES `user_report`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inquiry` ADD CONSTRAINT `inquiry_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `restriction` ADD CONSTRAINT `restriction_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `weekly_report` ADD CONSTRAINT `weekly_report_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `weekly_report_emotion` ADD CONSTRAINT `weekly_report_emotion_report_id_fkey` FOREIGN KEY (`report_id`) REFERENCES `weekly_report`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `weekly_report_keyword` ADD CONSTRAINT `weekly_report_keyword_report_id_fkey` FOREIGN KEY (`report_id`) REFERENCES `weekly_report`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `weekly_report_highlight_letter` ADD CONSTRAINT `weekly_report_highlight_letter_report_id_fkey` FOREIGN KEY (`report_id`) REFERENCES `weekly_report`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `weekly_report_highlight_letter` ADD CONSTRAINT `weekly_report_highlight_letter_letter_id_fkey` FOREIGN KEY (`letter_id`) REFERENCES `letter`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
