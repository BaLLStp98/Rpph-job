const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedMissionGroupsAndDepartments() {
  try {
    console.log('🌱 เริ่มต้นการ seed ข้อมูล Mission Groups และ Hospital Departments...');

    // 1. สร้าง Mission Groups
    const missionGroups = [
      {
        id: 'mg_support_services',
        name: 'กลุ่มภารกิจด้านอำนวยการ สนับสนุนบริการ และระบบคุณภาพ',
        description: 'Support Services and Quality System Mission Group'
      },
      {
        id: 'mg_primary_care',
        name: 'กลุ่มภารกิจด้านบริการปฐมภูมิ',
        description: 'Primary Care Services Mission Group'
      },
      {
        id: 'mg_tertiary_care',
        name: 'กลุ่มภารกิจด้านบริการตติยภูมิ',
        description: 'Tertiary Care Services Mission Group'
      },
      {
        id: 'mg_nursing',
        name: 'กลุ่มภารกิจด้านการพยาบาล',
        description: 'Nursing Services Mission Group'
      }
    ];

    console.log('📝 สร้าง Mission Groups...');
    for (const group of missionGroups) {
      await prisma.missionGroup.upsert({
        where: { id: group.id },
        update: group,
        create: group
      });
      console.log(`✅ สร้าง Mission Group: ${group.name}`);
    }

    // 2. สร้าง Hospital Departments ตามแผนผังองค์กร
    const hospitalDepartments = [
      // กลุ่มภารกิจด้านอำนวยการ สนับสนุนบริการ และระบบคุณภาพ
      {
        name: 'ฝ่ายบริหารงานทั่วไป',
        description: 'General Administration Department',
        missionGroupId: 'mg_support_services'
      },
      {
        name: 'ฝ่ายพัสดุ',
        description: 'Supplies Department',
        missionGroupId: 'mg_support_services'
      },
      {
        name: 'ฝ่ายงบประมาณการเงินและบัญชี',
        description: 'Budget, Finance and Accounting Department',
        missionGroupId: 'mg_support_services'
      },
      {
        name: 'ฝ่ายซ่อมบำรุง',
        description: 'Maintenance Department',
        missionGroupId: 'mg_support_services'
      },
      {
        name: 'ฝ่ายวิชาการและแผนงาน',
        description: 'Academic and Planning Department',
        missionGroupId: 'mg_support_services'
      },
      {
        name: 'ฝ่ายโภชนาการ',
        description: 'Nutrition Department',
        missionGroupId: 'mg_support_services'
      },
      {
        name: 'กลุ่มงานพัฒนาคุณภาพ',
        description: 'Quality Development Work Group',
        missionGroupId: 'mg_support_services'
      },
      {
        name: 'กลุ่มงานแพทยศาสตรศึกษา',
        description: 'Medical Education Work Group',
        missionGroupId: 'mg_support_services'
      },
      {
        name: 'กลุ่มงานส่งเสริมการวิจัย',
        description: 'Research Promotion Work Group',
        missionGroupId: 'mg_support_services'
      },

      // กลุ่มภารกิจด้านบริการปฐมภูมิ
      {
        name: 'กลุ่มงานประกันสุขภาพ',
        description: 'Health Insurance Work Group',
        missionGroupId: 'mg_primary_care'
      },
      {
        name: 'กลุ่มงานการแพทย์แผนไทยและการแพทย์ทางเลือก',
        description: 'Thai Traditional Medicine and Alternative Medicine Work Group',
        missionGroupId: 'mg_primary_care'
      },
      {
        name: 'กลุ่มงานเวชศาสตร์ชุมชน',
        description: 'Community Medicine Work Group',
        missionGroupId: 'mg_primary_care'
      },
      {
        name: 'กลุ่มงานอาชีวเวชกรรม',
        description: 'Occupational Medicine Work Group',
        missionGroupId: 'mg_primary_care'
      },

      // กลุ่มภารกิจด้านบริการตติยภูมิ
      {
        name: 'กลุ่มงานเวชศาสตร์ฉุกเฉิน',
        description: 'Emergency Medicine Work Group',
        missionGroupId: 'mg_tertiary_care'
      },
      {
        name: 'กลุ่มงานศัลยกรรม',
        description: 'Surgery Work Group',
        missionGroupId: 'mg_tertiary_care'
      },
      {
        name: 'กลุ่มงานจักษุวิทยา',
        description: 'Ophthalmology Work Group',
        missionGroupId: 'mg_tertiary_care'
      },
      {
        name: 'กลุ่มงานกุมารเวชกรรม',
        description: 'Pediatrics Work Group',
        missionGroupId: 'mg_tertiary_care'
      },
      {
        name: 'กลุ่มงานออร์โธปิดิกส์',
        description: 'Orthopedics Work Group',
        missionGroupId: 'mg_tertiary_care'
      },
      {
        name: 'กลุ่มงานโสต ศอ นาสิก',
        description: 'Otolaryngology / ENT Work Group',
        missionGroupId: 'mg_tertiary_care'
      },
      {
        name: 'กลุ่มงานนิติเวชและพยาธิวิทยา',
        description: 'Forensic Medicine and Pathology Work Group',
        missionGroupId: 'mg_tertiary_care'
      },
      {
        name: 'กลุ่มงานอายุรกรรม',
        description: 'Internal Medicine Work Group',
        missionGroupId: 'mg_tertiary_care'
      },
      {
        name: 'กลุ่มงานสูติ - นรีเวชกรรม',
        description: 'Obstetrics - Gynecology Work Group',
        missionGroupId: 'mg_tertiary_care'
      },
      {
        name: 'กลุ่มงานวิสัญญีวิทยา',
        description: 'Anesthesiology Work Group',
        missionGroupId: 'mg_tertiary_care'
      },
      {
        name: 'กลุ่มงานจิตเวช',
        description: 'Psychiatry Work Group',
        missionGroupId: 'mg_tertiary_care'
      },
      {
        name: 'กลุ่มงานเวชศาสตร์ผู้สูงอายุ',
        description: 'Geriatric Medicine Work Group',
        missionGroupId: 'mg_tertiary_care'
      },
      {
        name: 'กลุ่มงานบริการการแพทย์ฉุกเฉินและรับส่งต่อ',
        description: 'Emergency Medical Services and Referral Work Group',
        missionGroupId: 'mg_tertiary_care'
      },
      {
        name: 'กลุ่มงานรังสีวิทยา',
        description: 'Radiology Work Group',
        missionGroupId: 'mg_tertiary_care'
      },
      {
        name: 'กลุ่มงานเทคนิคการแพทย์',
        description: 'Medical Technology Work Group',
        missionGroupId: 'mg_tertiary_care'
      },
      {
        name: 'กลุ่มงานเวชกรรมฟื้นฟู',
        description: 'Rehabilitation Medicine Work Group',
        missionGroupId: 'mg_tertiary_care'
      },
      {
        name: 'กลุ่มงานทันตกรรม',
        description: 'Dentistry Work Group',
        missionGroupId: 'mg_tertiary_care'
      },
      {
        name: 'กลุ่มงานเภสัชกรรม',
        description: 'Pharmacy Work Group',
        missionGroupId: 'mg_tertiary_care'
      },

      // กลุ่มภารกิจด้านการพยาบาล
      {
        name: 'กลุ่มงานการพยาบาลผู้ป่วยอุบัติฉุกเฉินและรับส่งต่อ',
        description: 'Emergency and Referral Patient Nursing Work Group',
        missionGroupId: 'mg_nursing'
      },
      {
        name: 'กลุ่มงานการพยาบาลผู้คลอด',
        description: 'Labor and Delivery Nursing Work Group',
        missionGroupId: 'mg_nursing'
      },
      {
        name: 'กลุ่มงานการพยาบาลวิสัญญี',
        description: 'Anesthesia Nursing Work Group',
        missionGroupId: 'mg_nursing'
      },
      {
        name: 'กลุ่มงานการพยาบาลผู้ป่วยหนัก',
        description: 'Critical Care Nursing Work Group',
        missionGroupId: 'mg_nursing'
      },
      {
        name: 'กลุ่มงานการพยาบาลผู้ป่วยห้องผ่าตัด',
        description: 'Operating Room Nursing Work Group',
        missionGroupId: 'mg_nursing'
      },
      {
        name: 'กลุ่มงานการพยาบาลผู้ป่วยอายุรกรรม',
        description: 'Internal Medicine Patient Nursing Work Group',
        missionGroupId: 'mg_nursing'
      },
      {
        name: 'กลุ่มงานการพยาบาลด้านการควบคุมและป้องกันผู้ติดเชื้อ',
        description: 'Infection Control and Prevention Nursing Work Group',
        missionGroupId: 'mg_nursing'
      },
      {
        name: 'กลุ่มงานการพยาบาลผู้ป่วยศัลยกรรม',
        description: 'Surgical Patient Nursing Work Group',
        missionGroupId: 'mg_nursing'
      },
      {
        name: 'กลุ่มงานการพยาบาลผู้ป่วยกุมารเวชกรรม',
        description: 'Pediatric Patient Nursing Work Group',
        missionGroupId: 'mg_nursing'
      },
      {
        name: 'กลุ่มงานการพยาบาลผู้ป่วยสูงอายุ',
        description: 'Geriatric Patient Nursing Work Group',
        missionGroupId: 'mg_nursing'
      },
      {
        name: 'กลุ่มงานการพยาบาลผู้ป่วยสูติ - นรีเวชกรรม',
        description: 'Obstetrics - Gynecology Patient Nursing Work Group',
        missionGroupId: 'mg_nursing'
      },
      {
        name: 'กลุ่มงานการพยาบาลผู้ป่วยออร์โธปิดิกส์',
        description: 'Orthopedic Patient Nursing Work Group',
        missionGroupId: 'mg_nursing'
      },
      {
        name: 'กลุ่มงานการพยาบาลตรวจรักษาพิเศษ',
        description: 'Special Examination and Treatment Nursing Work Group',
        missionGroupId: 'mg_nursing'
      },
      {
        name: 'กลุ่มงานการพยาบาลปฐมภูมิ',
        description: 'Primary Care Nursing Work Group',
        missionGroupId: 'mg_nursing'
      },
      {
        name: 'กลุ่มงานการพยาบาลผู้ป่วยนอกตรวจโรคเฉพาะทาง',
        description: 'Specialized Outpatient Department Nursing Work Group',
        missionGroupId: 'mg_nursing'
      },
      {
        name: 'กลุ่มงานวิจัยและพัฒนาการพยาบาล',
        description: 'Nursing Research and Development Work Group',
        missionGroupId: 'mg_nursing'
      }
    ];

    console.log('📝 สร้าง Hospital Departments...');
    for (const dept of hospitalDepartments) {
      await prisma.hospitalDepartment.create({
        data: dept
      });
      console.log(`✅ สร้าง Department: ${dept.name}`);
    }

    console.log('🎉 การ seed ข้อมูลเสร็จสิ้น!');
    console.log(`📊 สร้าง Mission Groups: ${missionGroups.length} รายการ`);
    console.log(`📊 สร้าง Hospital Departments: ${hospitalDepartments.length} รายการ`);

  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการ seed ข้อมูล:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// รันฟังก์ชัน
seedMissionGroupsAndDepartments();
