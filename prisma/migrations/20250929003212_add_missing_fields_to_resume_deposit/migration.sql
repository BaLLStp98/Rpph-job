-- AlterTable
ALTER TABLE `resume_deposits` ADD COLUMN `medical_rights_dont_want_to_change_hospital` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `medical_rights_has_civil_servant_rights` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `medical_rights_has_social_security` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `medical_rights_has_universal_healthcare` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `medical_rights_new_hospital` VARCHAR(200) NULL,
    ADD COLUMN `medical_rights_other_rights` TEXT NULL,
    ADD COLUMN `medical_rights_social_security_hospital` VARCHAR(200) NULL,
    ADD COLUMN `medical_rights_universal_healthcare_hospital` VARCHAR(200) NULL,
    ADD COLUMN `medical_rights_want_to_change_hospital` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `multiple_employers` TEXT NULL,
    ADD COLUMN `spouse_first_name` VARCHAR(100) NULL,
    ADD COLUMN `spouse_last_name` VARCHAR(100) NULL,
    ADD COLUMN `staff_department` VARCHAR(200) NULL,
    ADD COLUMN `staff_position` VARCHAR(200) NULL,
    ADD COLUMN `staff_start_work` VARCHAR(50) NULL;

-- CreateTable
CREATE TABLE `resume_deposit_previous_government_service` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `resume_deposit_id` VARCHAR(191) NOT NULL,
    `position` VARCHAR(200) NOT NULL,
    `department` VARCHAR(200) NOT NULL,
    `reason` TEXT NOT NULL,
    `date` VARCHAR(50) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `resume_deposit_prev_gov_service_resume_deposit_id_fkey`(`resume_deposit_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `resume_deposit_previous_government_service` ADD CONSTRAINT `resume_deposit_previous_government_service_resume_deposit_i_fkey` FOREIGN KEY (`resume_deposit_id`) REFERENCES `resume_deposits`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
