-- Database Schema for RPPH Job Application System
-- Created for storing register data from @register/

-- Create database
CREATE DATABASE IF NOT EXISTS rpph_job_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE rpph_job_system;

-- Main users table (from register data)
CREATE TABLE users (
    id VARCHAR(20) PRIMARY KEY,
    line_id VARCHAR(100) UNIQUE,
    prefix VARCHAR(10),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    line_display_name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    gender ENUM('ชาย', 'หญิง', 'ไม่ระบุ') DEFAULT 'ไม่ระบุ',
    birth_date DATE,
    nationality VARCHAR(50) DEFAULT 'ไทย',
    religion VARCHAR(50),
    marital_status ENUM('โสด', 'สมรส', 'หย่า', 'หม้าย', 'ไม่ระบุ') DEFAULT 'ไม่ระบุ',
    address TEXT,
    province VARCHAR(100),
    district VARCHAR(100),
    sub_district VARCHAR(100),
    postal_code VARCHAR(10),
    emergency_contact VARCHAR(100),
    emergency_phone VARCHAR(20),
    is_hospital_staff BOOLEAN DEFAULT FALSE,
    hospital_department VARCHAR(100),
    username VARCHAR(50) UNIQUE,
    password VARCHAR(255),
    profile_image_url VARCHAR(255),
    status ENUM('รอดำเนินการ', 'เปิดใช้งาน', 'ปิดการใช้งาน') DEFAULT 'รอดำเนินการ',
    department VARCHAR(100),
    role ENUM('เจ้าหน้าที่โรงพยาบาล', 'ผู้สมัครงาน') DEFAULT 'ผู้สมัครงาน',
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_line_id (line_id),
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_status (status),
    INDEX idx_department (department),
    INDEX idx_created_at (created_at)
);

-- Education history table
CREATE TABLE user_education (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(20) NOT NULL,
    level VARCHAR(50),
    school VARCHAR(200),
    major VARCHAR(200),
    start_year VARCHAR(10),
    end_year VARCHAR(10),
    gpa DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
);

-- Work experience table
CREATE TABLE user_work_experience (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(20) NOT NULL,
    position VARCHAR(200),
    company VARCHAR(200),
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    description TEXT,
    salary VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_company (company)
);

-- Application forms table (from application-form data)
CREATE TABLE application_forms (
    id VARCHAR(20) PRIMARY KEY,
    user_id VARCHAR(20),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    prefix VARCHAR(10),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    id_number VARCHAR(20),
    id_card_issued_at VARCHAR(100),
    id_card_issue_date DATE,
    id_card_expiry_date DATE,
    age INT,
    race VARCHAR(50),
    place_of_birth VARCHAR(100),
    gender ENUM('ชาย', 'หญิง', 'ไม่ระบุ') DEFAULT 'ไม่ระบุ',
    nationality VARCHAR(50) DEFAULT 'ไทย',
    religion VARCHAR(50),
    marital_status ENUM('โสด', 'สมรส', 'หย่า', 'หม้าย', 'ไม่ระบุ') DEFAULT 'ไม่ระบุ',
    spouse_first_name VARCHAR(100),
    spouse_last_name VARCHAR(100),
    address_according_to_house_registration TEXT,
    current_address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    emergency_contact VARCHAR(100),
    emergency_phone VARCHAR(20),
    emergency_relationship VARCHAR(50),
    applied_position VARCHAR(200),
    expected_salary VARCHAR(100),
    available_date DATE,
    current_work BOOLEAN DEFAULT FALSE,
    department VARCHAR(100),
    skills TEXT,
    languages TEXT,
    computer_skills TEXT,
    certificates TEXT,
    references TEXT,
    profile_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_department (department),
    INDEX idx_submitted_at (submitted_at)
);

-- Education details for application forms
CREATE TABLE application_education (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id VARCHAR(20) NOT NULL,
    level VARCHAR(50),
    institution VARCHAR(200),
    major VARCHAR(200),
    year VARCHAR(10),
    gpa DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (application_id) REFERENCES application_forms(id) ON DELETE CASCADE,
    INDEX idx_application_id (application_id)
);

-- Work experience for application forms
CREATE TABLE application_work_experience (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id VARCHAR(20) NOT NULL,
    position VARCHAR(200),
    company VARCHAR(200),
    start_date DATE,
    end_date DATE,
    salary VARCHAR(50),
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (application_id) REFERENCES application_forms(id) ON DELETE CASCADE,
    INDEX idx_application_id (application_id)
);

-- Documents table
CREATE TABLE application_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id VARCHAR(20) NOT NULL,
    document_type ENUM('idCard', 'houseRegistration', 'militaryCertificate', 'educationCertificate', 'medicalCertificate', 'drivingLicense', 'nameChangeCertificate', 'otherDocuments') NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500),
    file_size INT,
    mime_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (application_id) REFERENCES application_forms(id) ON DELETE CASCADE,
    INDEX idx_application_id (application_id),
    INDEX idx_document_type (document_type)
);

-- Hospital departments table
CREATE TABLE hospital_departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_name (name),
    INDEX idx_is_active (is_active)
);

-- Insert sample hospital departments
INSERT INTO hospital_departments (name, description) VALUES
('งานเทคโนโลยีสารสนเทศ', 'ดูแลระบบคอมพิวเตอร์และเทคโนโลยี'),
('แผนกการเงินและบัญชี', 'จัดการด้านการเงินและบัญชี'),
('แผนกการตลาด', 'ดูแลด้านการตลาดและประชาสัมพันธ์'),
('แผนกผลิต', 'ดูแลการผลิตและควบคุมคุณภาพ'),
('แผนกบุคคล', 'จัดการด้านทรัพยากรบุคคล'),
('แผนกการแพทย์', 'ดูแลด้านการรักษาพยาบาล'),
('แผนกเภสัชกรรม', 'ดูแลด้านยาและเภสัชกรรม'),
('แผนกพยาบาล', 'ดูแลด้านการพยาบาล');

-- Create views for easier data access
CREATE VIEW user_profile_view AS
SELECT 
    u.id,
    u.line_id,
    u.prefix,
    u.first_name,
    u.last_name,
    u.line_display_name,
    u.email,
    u.phone,
    u.gender,
    u.birth_date,
    u.nationality,
    u.religion,
    u.marital_status,
    u.address,
    u.province,
    u.district,
    u.sub_district,
    u.postal_code,
    u.emergency_contact,
    u.emergency_phone,
    u.is_hospital_staff,
    u.hospital_department,
    u.username,
    u.profile_image_url,
    u.status,
    u.department,
    u.role,
    u.last_login,
    u.created_at,
    u.updated_at
FROM users u;

CREATE VIEW application_summary_view AS
SELECT 
    af.id,
    af.user_id,
    u.first_name,
    u.last_name,
    u.email,
    af.applied_position,
    af.department,
    af.status,
    af.submitted_at,
    af.created_at,
    af.updated_at
FROM application_forms af
LEFT JOIN users u ON af.user_id = u.id;

-- Create indexes for better performance
CREATE INDEX idx_users_status_department ON users(status, department);
CREATE INDEX idx_application_forms_status_department ON application_forms(status, department);
CREATE INDEX idx_application_forms_submitted_at ON application_forms(submitted_at);

-- Create stored procedures for common operations
DELIMITER //

-- Procedure to get user with education and work experience
CREATE PROCEDURE GetUserWithDetails(IN user_id_param VARCHAR(20))
BEGIN
    -- Get user basic info
    SELECT * FROM users WHERE id = user_id_param;
    
    -- Get education
    SELECT * FROM user_education WHERE user_id = user_id_param ORDER BY created_at;
    
    -- Get work experience
    SELECT * FROM user_work_experience WHERE user_id = user_id_param ORDER BY start_date DESC;
END //

-- Procedure to get application with details
CREATE PROCEDURE GetApplicationWithDetails(IN application_id_param VARCHAR(20))
BEGIN
    -- Get application basic info
    SELECT * FROM application_forms WHERE id = application_id_param;
    
    -- Get education
    SELECT * FROM application_education WHERE application_id = application_id_param ORDER BY created_at;
    
    -- Get work experience
    SELECT * FROM application_work_experience WHERE application_id = application_id_param ORDER BY start_date DESC;
    
    -- Get documents
    SELECT * FROM application_documents WHERE application_id = application_id_param;
END //

-- Procedure to update user status
CREATE PROCEDURE UpdateUserStatus(IN user_id_param VARCHAR(20), IN new_status VARCHAR(20))
BEGIN
    UPDATE users 
    SET status = new_status, updated_at = CURRENT_TIMESTAMP 
    WHERE id = user_id_param;
    
    SELECT ROW_COUNT() as affected_rows;
END //

DELIMITER ;

-- Grant permissions (adjust as needed for your environment)
-- GRANT ALL PRIVILEGES ON rpph_job_system.* TO 'your_username'@'localhost';
-- FLUSH PRIVILEGES;