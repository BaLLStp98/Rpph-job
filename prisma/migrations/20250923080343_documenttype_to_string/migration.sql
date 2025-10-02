/*
  Warnings:

  - You are about to alter the column `document_type` on the `application_documents` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE `application_documents` MODIFY `document_type` VARCHAR(100) NOT NULL;
