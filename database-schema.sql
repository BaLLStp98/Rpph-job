-- Job Applications Database Schema
-- This file contains the SQL schema for the job applications system

-- Create job_applications table
CREATE TABLE job_applications (
    id SERIAL PRIMARY KEY,
    prefix VARCHAR(10) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    birth_date DATE NOT NULL,
    nationality VARCHAR(50),
    religion VARCHAR(50),
    marital_status VARCHAR(20),
    address TEXT NOT NULL,
    province VARCHAR(100),
    district VARCHAR(100),
    sub_district VARCHAR(100),
    postal_code VARCHAR(10),
    emergency_contact VARCHAR(100),
    emergency_phone VARCHAR(20),
    profile_image_url VARCHAR(500),
    education_list JSONB,
    work_list JSONB,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better performance
CREATE INDEX idx_job_applications_email ON job_applications(email);
CREATE INDEX idx_job_applications_status ON job_applications(status);
CREATE INDEX idx_job_applications_created_at ON job_applications(created_at);

-- Create applications_status table for tracking status changes
CREATE TABLE application_status_history (
    id SERIAL PRIMARY KEY,
    application_id INTEGER REFERENCES job_applications(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data (optional)
INSERT INTO job_applications (
    prefix, first_name, last_name, email, phone, gender, birth_date,
    nationality, religion, marital_status, address, province, district,
    sub_district, postal_code, emergency_contact, emergency_phone,
    education_list, work_list, status
) VALUES (
    'นาย', 'สมชาย', 'ใจดี', 'somchai@example.com', '0812345678', 'ชาย', '1990-01-15',
    'ไทย', 'พุทธ', 'โสด', '123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย', 'กรุงเทพมหานคร', 'คลองเตย',
    'คลองเตย', '10110', 'นางสมหญิง ใจดี', '0898765432',
    '[{"level":"ปริญญาตรี","school":"มหาวิทยาลัยธรรมศาสตร์","major":"วิศวกรรมศาสตร์","startYear":"2008","endYear":"2012","gpa":"3.5"}]',
    '[{"position":"วิศวกร","company":"บริษัท ABC จำกัด","startDate":"2012-06-01","endDate":"2020-12-31","isCurrent":false,"description":"ดูแลระบบ IT","salary":"35000"}]',
    'pending'
); 