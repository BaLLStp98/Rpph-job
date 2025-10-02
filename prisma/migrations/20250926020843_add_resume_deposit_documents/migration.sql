-- CreateTable
CREATE TABLE `resume_deposits` (
    `id` VARCHAR(191) NOT NULL,
    `prefix` VARCHAR(10) NULL,
    `first_name` VARCHAR(100) NOT NULL,
    `last_name` VARCHAR(100) NOT NULL,
    `id_number` VARCHAR(20) NULL,
    `id_card_issued_at` VARCHAR(100) NULL,
    `id_card_issue_date` DATE NULL,
    `id_card_expiry_date` DATE NULL,
    `birth_date` DATE NULL,
    `age` INTEGER NULL,
    `race` VARCHAR(50) NULL,
    `place_of_birth` VARCHAR(100) NULL,
    `place_of_birth_province` VARCHAR(100) NULL,
    `gender` ENUM('MALE', 'FEMALE', 'UNKNOWN') NOT NULL DEFAULT 'UNKNOWN',
    `nationality` VARCHAR(50) NULL DEFAULT 'ไทย',
    `religion` VARCHAR(50) NULL,
    `marital_status` ENUM('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', 'UNKNOWN') NOT NULL DEFAULT 'UNKNOWN',
    `address` TEXT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `emergency_contact` VARCHAR(100) NULL,
    `emergency_phone` VARCHAR(20) NULL,
    `emergency_relationship` VARCHAR(50) NULL,
    `emergency_workplace_name` VARCHAR(200) NULL,
    `emergency_workplace_district` VARCHAR(100) NULL,
    `emergency_workplace_province` VARCHAR(100) NULL,
    `emergency_workplace_phone` VARCHAR(20) NULL,
    `skills` TEXT NULL,
    `languages` TEXT NULL,
    `computer_skills` TEXT NULL,
    `certificates` TEXT NULL,
    `references` TEXT NULL,
    `expected_position` VARCHAR(200) NULL,
    `expected_salary` VARCHAR(50) NULL,
    `available_date` DATE NULL,
    `department` VARCHAR(100) NULL,
    `unit` VARCHAR(100) NULL,
    `additional_info` TEXT NULL,
    `profile_image_url` VARCHAR(255) NULL,
    `status` ENUM('PENDING', 'REVIEWING', 'CONTACTED', 'HIRED', 'REJECTED', 'ARCHIVED') NOT NULL DEFAULT 'PENDING',
    `notes` TEXT NULL,
    `reviewed_by` VARCHAR(100) NULL,
    `reviewed_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `house_registration_house_number` VARCHAR(20) NULL,
    `house_registration_village_number` VARCHAR(20) NULL,
    `house_registration_alley` VARCHAR(100) NULL,
    `house_registration_road` VARCHAR(100) NULL,
    `house_registration_sub_district` VARCHAR(100) NULL,
    `house_registration_district` VARCHAR(100) NULL,
    `house_registration_province` VARCHAR(100) NULL,
    `house_registration_postal_code` VARCHAR(10) NULL,
    `house_registration_phone` VARCHAR(20) NULL,
    `house_registration_mobile` VARCHAR(20) NULL,
    `current_address_house_number` VARCHAR(20) NULL,
    `current_address_village_number` VARCHAR(20) NULL,
    `current_address_alley` VARCHAR(100) NULL,
    `current_address_road` VARCHAR(100) NULL,
    `current_address_sub_district` VARCHAR(100) NULL,
    `current_address_district` VARCHAR(100) NULL,
    `current_address_province` VARCHAR(100) NULL,
    `current_address_postal_code` VARCHAR(10) NULL,
    `current_address_phone` VARCHAR(20) NULL,
    `current_address_mobile` VARCHAR(20) NULL,
    `emergency_address_house_number` VARCHAR(20) NULL,
    `emergency_address_village_number` VARCHAR(20) NULL,
    `emergency_address_alley` VARCHAR(100) NULL,
    `emergency_address_road` VARCHAR(100) NULL,
    `emergency_address_sub_district` VARCHAR(100) NULL,
    `emergency_address_district` VARCHAR(100) NULL,
    `emergency_address_province` VARCHAR(100) NULL,
    `emergency_address_postal_code` VARCHAR(10) NULL,
    `emergency_address_phone` VARCHAR(20) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `resume_deposit_education` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `resume_deposit_id` VARCHAR(191) NOT NULL,
    `level` VARCHAR(100) NOT NULL,
    `school` VARCHAR(200) NOT NULL,
    `major` VARCHAR(200) NULL,
    `start_year` VARCHAR(10) NULL,
    `end_year` VARCHAR(10) NULL,
    `gpa` DOUBLE NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `resume_deposit_work_experience` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `resume_deposit_id` VARCHAR(191) NOT NULL,
    `position` VARCHAR(200) NOT NULL,
    `company` VARCHAR(200) NOT NULL,
    `start_date` DATE NULL,
    `end_date` DATE NULL,
    `is_current` BOOLEAN NOT NULL DEFAULT false,
    `description` TEXT NULL,
    `salary` VARCHAR(50) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `resume_deposit_documents` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `resume_deposit_id` VARCHAR(191) NOT NULL,
    `document_type` VARCHAR(100) NOT NULL,
    `file_name` VARCHAR(255) NOT NULL,
    `file_path` VARCHAR(500) NULL,
    `file_size` INTEGER NULL,
    `mime_type` VARCHAR(100) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `resume_deposit_documents_resume_deposit_id_fkey`(`resume_deposit_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `resume_deposit_education` ADD CONSTRAINT `resume_deposit_education_resume_deposit_id_fkey` FOREIGN KEY (`resume_deposit_id`) REFERENCES `resume_deposits`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resume_deposit_work_experience` ADD CONSTRAINT `resume_deposit_work_experience_resume_deposit_id_fkey` FOREIGN KEY (`resume_deposit_id`) REFERENCES `resume_deposits`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resume_deposit_documents` ADD CONSTRAINT `resume_deposit_documents_resume_deposit_id_fkey` FOREIGN KEY (`resume_deposit_id`) REFERENCES `resume_deposits`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
