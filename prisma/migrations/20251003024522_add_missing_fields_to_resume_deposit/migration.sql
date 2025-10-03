-- AlterTable
ALTER TABLE `resume_deposits` ADD COLUMN `address_according_to_house_registration` TEXT NULL,
ADD COLUMN `applicant_signature` VARCHAR(255) NULL,
ADD COLUMN `application_date` DATE NULL,
ADD COLUMN `current_work` BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN `emergency_address` JSON NULL,
ADD COLUMN `emergency_contact_first_name` VARCHAR(100) NULL,
ADD COLUMN `emergency_contact_last_name` VARCHAR(100) NULL;
