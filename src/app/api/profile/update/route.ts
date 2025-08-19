import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { personalInfoId, personalInfo, education, workExperience, additionalInfo, jobInfo } = body;

    if (!personalInfoId) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบ ID ของข้อมูลส่วนตัว' },
        { status: 400 }
      );
    }

    // สร้าง connection ไปยัง MySQL
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'mydata'
    });

    // อัปเดตข้อมูลส่วนตัว
    await connection.execute(
      `UPDATE application_personal_info SET 
       prefix = ?, first_name = ?, last_name = ?, id_number = ?, birth_date = ?, 
       age = ?, gender = ?, nationality = ?, religion = ?, marital_status = ?, 
       address = ?, phone = ?, email = ?, emergency_contact = ?, emergency_phone = ?,
       updated_at = NOW()
       WHERE id = ?`,
      [
        personalInfo.prefix, personalInfo.firstName, personalInfo.lastName, personalInfo.idNumber,
        personalInfo.birthDate, personalInfo.age, personalInfo.gender, personalInfo.nationality,
        personalInfo.religion, personalInfo.maritalStatus, personalInfo.address, personalInfo.phone,
        personalInfo.email, personalInfo.emergencyContact, personalInfo.emergencyPhone, personalInfoId
      ]
    );

    // ลบข้อมูลการศึกษาเดิมและเพิ่มใหม่
    await connection.execute(
      'DELETE FROM application_education WHERE personal_info_id = ?',
      [personalInfoId]
    );

    for (const edu of education) {
      if (edu.level && edu.institution) {
        await connection.execute(
          `INSERT INTO application_education 
           (personal_info_id, level, institution, major, year, gpa) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [personalInfoId, edu.level, edu.institution, edu.major, edu.year, edu.gpa]
        );
      }
    }

    // ลบข้อมูลการทำงานเดิมและเพิ่มใหม่
    await connection.execute(
      'DELETE FROM application_work_experience WHERE personal_info_id = ?',
      [personalInfoId]
    );

    for (const work of workExperience) {
      if (work.position && work.company) {
        await connection.execute(
          `INSERT INTO application_work_experience 
           (personal_info_id, position, company, start_date, end_date, salary, reason) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [personalInfoId, work.position, work.company, work.startDate, work.endDate, work.salary, work.reason]
        );
      }
    }

    // อัปเดตข้อมูลเพิ่มเติม
    if (additionalInfo) {
      await connection.execute(
        `UPDATE application_additional_info SET 
         skills = ?, languages = ?, computer_skills = ?, certificates = ?, references = ?
         WHERE personal_info_id = ?`,
        [additionalInfo.skills, additionalInfo.languages, additionalInfo.computerSkills, 
         additionalInfo.certificates, additionalInfo.references, personalInfoId]
      );
    }

    // อัปเดตข้อมูลการสมัคร
    if (jobInfo) {
      await connection.execute(
        `UPDATE application_job_info SET 
         applied_position = ?, expected_salary = ?, available_date = ?, current_work = ?
         WHERE personal_info_id = ?`,
        [jobInfo.appliedPosition, jobInfo.expectedSalary, jobInfo.availableDate, 
         jobInfo.currentWork, personalInfoId]
      );
    }

    await connection.end();

    return NextResponse.json({
      success: true,
      message: 'อัปเดตข้อมูลเรียบร้อยแล้ว'
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล' },
      { status: 500 }
    );
  }
} 