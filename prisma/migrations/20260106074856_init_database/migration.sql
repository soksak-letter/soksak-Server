-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `nickname` VARCHAR(191) NULL,
    `phone_number` VARCHAR(191) NULL,
    `profile_image_url` VARCHAR(191) NULL,
    `bio` VARCHAR(191) NULL,
    `gender` VARCHAR(191) NULL,
    `age_range` VARCHAR(191) NULL,
    `job` VARCHAR(191) NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `deleted_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `user_email_key`(`email`),
    UNIQUE INDEX `user_phone_number_key`(`phone_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_notification_setting` (
    `user_id` INTEGER NOT NULL,
    `letter_enabled` BOOLEAN NOT NULL,
    `reply_enabled` BOOLEAN NOT NULL,
    `weekly_report_enabled` BOOLEAN NOT NULL,
    `marketing_enabled` BOOLEAN NOT NULL,
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_device_token` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `device_type` VARCHAR(191) NOT NULL,
    `device_token` VARCHAR(191) NOT NULL,
    `last_seen_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `user_device_token_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_agreement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `terms_agreed` BOOLEAN NOT NULL,
    `privacy_agreed` BOOLEAN NOT NULL,
    `age_over_14_agreed` BOOLEAN NOT NULL,
    `marketing_agreed` BOOLEAN NOT NULL,
    `agreed_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `user_agreement_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `auth` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `username` VARCHAR(191) NULL,
    `provider` VARCHAR(191) NOT NULL,
    `provider_user_id` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `password_hash` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `auth_user_id_key`(`user_id`),
    UNIQUE INDEX `auth_username_key`(`username`),
    UNIQUE INDEX `auth_email_key`(`email`),
    INDEX `auth_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `letter` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sender_user_id` INTEGER NOT NULL,
    `receiver_user_id` INTEGER NULL,
    `session_id` INTEGER NULL,
    `letter_type` VARCHAR(191) NOT NULL,
    `question_id` INTEGER NULL,
    `title` VARCHAR(191) NOT NULL,
    `content_cipher` TEXT NOT NULL,
    `is_public` BOOLEAN NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `scheduled_at` DATETIME(3) NULL,
    `delivered_at` DATETIME(3) NULL,
    `read_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `letter_sender_user_id_idx`(`sender_user_id`),
    INDEX `letter_receiver_user_id_idx`(`receiver_user_id`),
    INDEX `letter_session_id_idx`(`session_id`),
    INDEX `letter_question_id_idx`(`question_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `letter_design` (
    `letter_id` INTEGER NOT NULL,
    `paper_id` INTEGER NOT NULL,
    `stamp_id` INTEGER NOT NULL,
    `font_id` INTEGER NOT NULL,

    INDEX `letter_design_paper_id_idx`(`paper_id`),
    INDEX `letter_design_stamp_id_idx`(`stamp_id`),
    INDEX `letter_design_font_id_idx`(`font_id`),
    PRIMARY KEY (`letter_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `letter_asset_paper` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `asset_url` VARCHAR(191) NOT NULL,
    `is_active` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `letter_asset_stamp` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `asset_url` VARCHAR(191) NOT NULL,
    `is_active` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `letter_asset_font` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `font_family` VARCHAR(191) NOT NULL,
    `is_active` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `letter_emotion_tag` (
    `letter_id` INTEGER NOT NULL,
    `tag` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`letter_id`, `tag`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `letter_ai_keyword` (
    `letter_id` INTEGER NOT NULL,
    `keyword_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `letter_ai_keyword_keyword_id_idx`(`keyword_id`),
    PRIMARY KEY (`letter_id`, `keyword_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ai_keyword` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `is_active` BOOLEAN NOT NULL,

    UNIQUE INDEX `ai_keyword_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `letter_like` (
    `letter_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `letter_like_user_id_idx`(`user_id`),
    PRIMARY KEY (`letter_id`, `user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `friend_request` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `requester_user_id` INTEGER NOT NULL,
    `receiver_user_id` INTEGER NOT NULL,
    `session_id` INTEGER NULL,
    `status` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `friend_request_requester_user_id_idx`(`requester_user_id`),
    INDEX `friend_request_receiver_user_id_idx`(`receiver_user_id`),
    INDEX `friend_request_session_id_idx`(`session_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `friend` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_a_id` INTEGER NOT NULL,
    `user_b_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `friend_user_a_id_idx`(`user_a_id`),
    INDEX `friend_user_b_id_idx`(`user_b_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `block` (
    `blocker_user_id` INTEGER NOT NULL,
    `blocked_user_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `block_blocked_user_id_idx`(`blocked_user_id`),
    PRIMARY KEY (`blocker_user_id`, `blocked_user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_report` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reporter_user_id` INTEGER NOT NULL,
    `target_user_id` INTEGER NOT NULL,
    `letter_id` INTEGER NULL,
    `status` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `user_report_reporter_user_id_idx`(`reporter_user_id`),
    INDEX `user_report_target_user_id_idx`(`target_user_id`),
    INDEX `user_report_letter_id_idx`(`letter_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_report_reason` (
    `report_id` INTEGER NOT NULL,
    `reason` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`report_id`, `reason`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `weekly_report` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,
    `week` INTEGER NOT NULL,
    `summary_text` TEXT NULL,
    `generated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `weekly_report_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `weekly_report_emotion` (
    `report_id` INTEGER NOT NULL,
    `emotion` VARCHAR(191) NOT NULL,
    `ratio` DOUBLE NOT NULL,
    `count` INTEGER NOT NULL,

    PRIMARY KEY (`report_id`, `emotion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `weekly_report_keyword` (
    `report_id` INTEGER NOT NULL,
    `keyword` VARCHAR(191) NOT NULL,
    `count` INTEGER NOT NULL,

    PRIMARY KEY (`report_id`, `keyword`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `weekly_report_highlight_letter` (
    `report_id` INTEGER NOT NULL,
    `letter_id` INTEGER NOT NULL,
    `highlight_type` VARCHAR(191) NOT NULL,

    INDEX `weekly_report_highlight_letter_letter_id_idx`(`letter_id`),
    PRIMARY KEY (`report_id`, `letter_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_interest` (
    `user_id` INTEGER NOT NULL,
    `interest_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `user_interest_interest_id_idx`(`interest_id`),
    PRIMARY KEY (`user_id`, `interest_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `interest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `interest_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `question` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` TEXT NOT NULL,
    `is_active` BOOLEAN NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `daily_question` (
    `day` DATE NOT NULL,
    `question_id` INTEGER NOT NULL,
    `published_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `daily_question_question_id_idx`(`question_id`),
    PRIMARY KEY (`day`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `matching_session` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `question_id` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `max_turns` INTEGER NOT NULL DEFAULT 10,
    `started_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ended_at` DATETIME(3) NULL,

    INDEX `matching_session_question_id_idx`(`question_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `session_participant` (
    `session_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `role` VARCHAR(191) NULL,
    `joined_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `session_participant_user_id_idx`(`user_id`),
    PRIMARY KEY (`session_id`, `user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `session_review` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `session_id` INTEGER NOT NULL,
    `reviewer_user_id` INTEGER NOT NULL,
    `target_user_id` INTEGER NOT NULL,
    `temperature_score` INTEGER NOT NULL,
    `review_tag` VARCHAR(191) NOT NULL,
    `comment` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `session_review_session_id_idx`(`session_id`),
    INDEX `session_review_reviewer_user_id_idx`(`reviewer_user_id`),
    INDEX `session_review_target_user_id_idx`(`target_user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inquiry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `answer_content` TEXT NULL,
    `answered_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `inquiry_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `restriction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `reason` VARCHAR(191) NOT NULL,
    `starts_at` DATETIME(3) NOT NULL,
    `ends_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `restriction_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `pinned` BOOLEAN NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `policy_document` (
    `key` VARCHAR(191) NOT NULL,
    `version` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `effective_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_notification_setting` ADD CONSTRAINT `user_notification_setting_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_device_token` ADD CONSTRAINT `user_device_token_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_agreement` ADD CONSTRAINT `user_agreement_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `auth` ADD CONSTRAINT `auth_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `letter` ADD CONSTRAINT `letter_sender_user_id_fkey` FOREIGN KEY (`sender_user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `letter` ADD CONSTRAINT `letter_receiver_user_id_fkey` FOREIGN KEY (`receiver_user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `letter` ADD CONSTRAINT `letter_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `matching_session`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `letter` ADD CONSTRAINT `letter_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `question`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `letter_design` ADD CONSTRAINT `letter_design_letter_id_fkey` FOREIGN KEY (`letter_id`) REFERENCES `letter`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `letter_design` ADD CONSTRAINT `letter_design_paper_id_fkey` FOREIGN KEY (`paper_id`) REFERENCES `letter_asset_paper`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `letter_design` ADD CONSTRAINT `letter_design_stamp_id_fkey` FOREIGN KEY (`stamp_id`) REFERENCES `letter_asset_stamp`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `letter_design` ADD CONSTRAINT `letter_design_font_id_fkey` FOREIGN KEY (`font_id`) REFERENCES `letter_asset_font`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `letter_emotion_tag` ADD CONSTRAINT `letter_emotion_tag_letter_id_fkey` FOREIGN KEY (`letter_id`) REFERENCES `letter`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `letter_ai_keyword` ADD CONSTRAINT `letter_ai_keyword_letter_id_fkey` FOREIGN KEY (`letter_id`) REFERENCES `letter`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `letter_ai_keyword` ADD CONSTRAINT `letter_ai_keyword_keyword_id_fkey` FOREIGN KEY (`keyword_id`) REFERENCES `ai_keyword`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `letter_like` ADD CONSTRAINT `letter_like_letter_id_fkey` FOREIGN KEY (`letter_id`) REFERENCES `letter`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `letter_like` ADD CONSTRAINT `letter_like_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `friend_request` ADD CONSTRAINT `friend_request_requester_user_id_fkey` FOREIGN KEY (`requester_user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `friend_request` ADD CONSTRAINT `friend_request_receiver_user_id_fkey` FOREIGN KEY (`receiver_user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `friend_request` ADD CONSTRAINT `friend_request_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `matching_session`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

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
ALTER TABLE `daily_question` ADD CONSTRAINT `daily_question_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `question`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `matching_session` ADD CONSTRAINT `matching_session_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `question`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

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
