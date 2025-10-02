-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `line_id` VARCHAR(191) NULL,
    `prefix` VARCHAR(10) NULL,
    `first_name` VARCHAR(100) NOT NULL,
    `last_name` VARCHAR(100) NOT NULL,
    `line_display_name` VARCHAR(100) NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(20) NULL,
    `gender` ENUM('MALE', 'FEMALE', 'UNKNOWN') NOT NULL DEFAULT 'UNKNOWN',
    `birth_date` DATE NULL,
    `nationality` VARCHAR(50) NULL DEFAULT 'ไทย',
    `religion` VARCHAR(50) NULL,
    `marital_status` ENUM('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', 'UNKNOWN') NOT NULL DEFAULT 'UNKNOWN',
    `address` TEXT NULL,
    `province` VARCHAR(100) NULL,
    `district` VARCHAR(100) NULL,
    `sub_district` VARCHAR(100) NULL,
    `postal_code` VARCHAR(10) NULL,
    `emergency_contact` VARCHAR(100) NULL,
    `emergency_phone` VARCHAR(20) NULL,
    `is_hospital_staff` BOOLEAN NOT NULL DEFAULT false,
    `hospital_department` VARCHAR(100) NULL,
    `username` VARCHAR(50) NULL,
    `password` VARCHAR(255) NULL,
    `profile_image_url` VARCHAR(255) NULL,
    `status` ENUM('PENDING', 'ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'PENDING',
    `department` VARCHAR(100) NULL,
    `role` ENUM('HOSPITAL_STAFF', 'APPLICANT') NOT NULL DEFAULT 'APPLICANT',
    `last_login` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_line_id_key`(`line_id`),
    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_education` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `level` VARCHAR(50) NULL,
    `school` VARCHAR(200) NULL,
    `major` VARCHAR(200) NULL,
    `start_year` VARCHAR(10) NULL,
    `end_year` VARCHAR(10) NULL,
    `gpa` DECIMAL(3, 2) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_work_experience` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `position` VARCHAR(200) NULL,
    `company` VARCHAR(200) NULL,
    `start_date` DATE NULL,
    `end_date` DATE NULL,
    `is_current` BOOLEAN NOT NULL DEFAULT false,
    `description` TEXT NULL,
    `salary` VARCHAR(50) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `application_forms` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NULL,
    `submitted_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
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
    `gender` ENUM('MALE', 'FEMALE', 'UNKNOWN') NOT NULL DEFAULT 'UNKNOWN',
    `nationality` VARCHAR(50) NULL DEFAULT 'ไทย',
    `religion` VARCHAR(50) NULL,
    `marital_status` ENUM('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', 'UNKNOWN') NOT NULL DEFAULT 'UNKNOWN',
    `address_according_to_house_registration` TEXT NULL,
    `current_address` TEXT NULL,
    `phone` VARCHAR(20) NULL,
    `email` VARCHAR(255) NULL,
    `emergency_contact` VARCHAR(100) NULL,
    `emergency_phone` VARCHAR(20) NULL,
    `emergency_relationship` VARCHAR(50) NULL,
    `applied_position` VARCHAR(200) NULL,
    `expected_salary` VARCHAR(100) NULL,
    `available_date` DATE NULL,
    `current_work` BOOLEAN NOT NULL DEFAULT false,
    `department` VARCHAR(100) NULL,
    `skills` TEXT NULL,
    `languages` TEXT NULL,
    `computer_skills` TEXT NULL,
    `certificates` TEXT NULL,
    `references` TEXT NULL,
    `profile_image` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `application_education` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `application_id` VARCHAR(191) NOT NULL,
    `level` VARCHAR(50) NULL,
    `institution` VARCHAR(200) NULL,
    `major` VARCHAR(200) NULL,
    `year` VARCHAR(10) NULL,
    `gpa` DECIMAL(3, 2) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `application_work_experience` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `application_id` VARCHAR(191) NOT NULL,
    `position` VARCHAR(200) NULL,
    `company` VARCHAR(200) NULL,
    `start_date` DATE NULL,
    `end_date` DATE NULL,
    `salary` VARCHAR(50) NULL,
    `reason` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `application_documents` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `application_id` VARCHAR(191) NOT NULL,
    `document_type` ENUM('ID_CARD', 'HOUSE_REGISTRATION', 'MILITARY_CERTIFICATE', 'EDUCATION_CERTIFICATE', 'MEDICAL_CERTIFICATE', 'DRIVING_LICENSE', 'NAME_CHANGE_CERTIFICATE', 'OTHER_DOCUMENTS') NOT NULL,
    `file_name` VARCHAR(255) NOT NULL,
    `file_path` VARCHAR(500) NULL,
    `file_size` INTEGER NULL,
    `mime_type` VARCHAR(100) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hospital_departments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(200) NOT NULL,
    `description` TEXT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `departments` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `code` VARCHAR(20) NOT NULL,
    `description` TEXT NULL,
    `manager` VARCHAR(200) NULL,
    `manager_email` VARCHAR(255) NULL,
    `manager_phone` VARCHAR(20) NULL,
    `location` VARCHAR(200) NULL,
    `employee_count` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('ACTIVE', 'INACTIVE', 'PENDING') NOT NULL DEFAULT 'ACTIVE',
    `salary` VARCHAR(100) NULL,
    `application_start_date` DATE NULL,
    `application_end_date` DATE NULL,
    `education` TEXT NULL,
    `gender` ENUM('MALE', 'FEMALE', 'UNKNOWN') NOT NULL DEFAULT 'UNKNOWN',
    `positions` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `department_attachments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `department_id` VARCHAR(191) NOT NULL,
    `path` VARCHAR(500) NOT NULL,
    `filename` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contract_renewals` (
    `id` VARCHAR(191) NOT NULL,
    `employeeId` VARCHAR(50) NOT NULL,
    `employeeName` VARCHAR(200) NOT NULL,
    `department` VARCHAR(200) NOT NULL,
    `position` VARCHAR(200) NOT NULL,
    `new_start_date` DATE NULL,
    `new_end_date` DATE NULL,
    `contract_start_date` DATE NULL,
    `contract_end_date` DATE NULL,
    `new_salary` VARCHAR(100) NULL,
    `notes` TEXT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contract_renewal_attachments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `contract_renewal_id` VARCHAR(191) NOT NULL,
    `file_name` VARCHAR(255) NOT NULL,
    `file_path` VARCHAR(500) NULL,
    `mime_type` VARCHAR(100) NULL,
    `file_size` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_education` ADD CONSTRAINT `user_education_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_work_experience` ADD CONSTRAINT `user_work_experience_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `application_forms` ADD CONSTRAINT `application_forms_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `application_education` ADD CONSTRAINT `application_education_application_id_fkey` FOREIGN KEY (`application_id`) REFERENCES `application_forms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `application_work_experience` ADD CONSTRAINT `application_work_experience_application_id_fkey` FOREIGN KEY (`application_id`) REFERENCES `application_forms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `application_documents` ADD CONSTRAINT `application_documents_application_id_fkey` FOREIGN KEY (`application_id`) REFERENCES `application_forms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `department_attachments` ADD CONSTRAINT `department_attachments_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contract_renewal_attachments` ADD CONSTRAINT `contract_renewal_attachments_contract_renewal_id_fkey` FOREIGN KEY (`contract_renewal_id`) REFERENCES `contract_renewals`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
