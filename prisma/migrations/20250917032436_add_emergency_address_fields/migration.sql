-- AlterTable
ALTER TABLE `application_forms` ADD COLUMN `emergency_address_alley` VARCHAR(100) NULL,
    ADD COLUMN `emergency_address_district` VARCHAR(100) NULL,
    ADD COLUMN `emergency_address_house_number` VARCHAR(20) NULL,
    ADD COLUMN `emergency_address_phone` VARCHAR(20) NULL,
    ADD COLUMN `emergency_address_postal_code` VARCHAR(10) NULL,
    ADD COLUMN `emergency_address_province` VARCHAR(100) NULL,
    ADD COLUMN `emergency_address_road` VARCHAR(100) NULL,
    ADD COLUMN `emergency_address_sub_district` VARCHAR(100) NULL,
    ADD COLUMN `emergency_address_village_number` VARCHAR(20) NULL;
