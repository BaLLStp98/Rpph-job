-- AlterTable
ALTER TABLE `departments` ADD COLUMN `mission_group_id` VARCHAR(50) NULL;

-- CreateTable
CREATE TABLE `mission_groups` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `code` VARCHAR(20) NOT NULL,
    `description` TEXT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `mission_groups_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `departments` ADD CONSTRAINT `departments_mission_group_id_fkey` FOREIGN KEY (`mission_group_id`) REFERENCES `mission_groups`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
