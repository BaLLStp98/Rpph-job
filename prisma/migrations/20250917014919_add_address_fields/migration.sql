/*
  Warnings:

  - You are about to drop the column `new_salary` on the `contract_renewals` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `application_forms` ADD COLUMN `current_address_alley` VARCHAR(100) NULL,
    ADD COLUMN `current_address_district` VARCHAR(100) NULL,
    ADD COLUMN `current_address_house_number` VARCHAR(20) NULL,
    ADD COLUMN `current_address_mobile` VARCHAR(20) NULL,
    ADD COLUMN `current_address_phone` VARCHAR(20) NULL,
    ADD COLUMN `current_address_postal_code` VARCHAR(10) NULL,
    ADD COLUMN `current_address_province` VARCHAR(100) NULL,
    ADD COLUMN `current_address_road` VARCHAR(100) NULL,
    ADD COLUMN `current_address_sub_district` VARCHAR(100) NULL,
    ADD COLUMN `current_address_village_number` VARCHAR(20) NULL,
    ADD COLUMN `house_registration_alley` VARCHAR(100) NULL,
    ADD COLUMN `house_registration_district` VARCHAR(100) NULL,
    ADD COLUMN `house_registration_house_number` VARCHAR(20) NULL,
    ADD COLUMN `house_registration_mobile` VARCHAR(20) NULL,
    ADD COLUMN `house_registration_phone` VARCHAR(20) NULL,
    ADD COLUMN `house_registration_postal_code` VARCHAR(10) NULL,
    ADD COLUMN `house_registration_province` VARCHAR(100) NULL,
    ADD COLUMN `house_registration_road` VARCHAR(100) NULL,
    ADD COLUMN `house_registration_sub_district` VARCHAR(100) NULL,
    ADD COLUMN `house_registration_village_number` VARCHAR(20) NULL;

-- AlterTable
ALTER TABLE `contract_renewals` DROP COLUMN `new_salary`;
