// ทดสอบการดึงข้อมูล ContractRenewal จากฐานข้อมูล

const testContractRenewalAPI = async () => {
  try {
    console.log('🔄 กำลังทดสอบการดึงข้อมูล ContractRenewal...');
    
    // ทดสอบดึงข้อมูลทั้งหมด
    const response = await fetch('http://localhost:3000/api/contract-renewals');
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ ดึงข้อมูลสำเร็จ!');
      console.log('📊 จำนวนข้อมูล:', result.data.length);
      console.log('📋 ข้อมูลทั้งหมด:', result.data);
      
      // แสดงสถิติ
      const stats = {
        total: result.data.length,
        pending: result.data.filter(item => item.status === 'PENDING').length,
        approved: result.data.filter(item => item.status === 'APPROVED').length,
        rejected: result.data.filter(item => item.status === 'REJECTED').length
      };
      
      console.log('📈 สถิติข้อมูล:', stats);
      
      // แสดงข้อมูลในรูปแบบตาราง
      if (result.data.length > 0) {
        console.table(result.data.map((item, index) => ({
          '#': index + 1,
          'ID': item.id,
          'ชื่อ-นามสกุล': item.employeeName,
          'หน่วยงาน': item.department,
          'ตำแหน่ง': item.position,
          'สถานะ': item.status,
          'วันที่เริ่มใหม่': item.newStartDate ? new Date(item.newStartDate).toLocaleDateString('th-TH') : '-',
          'วันที่สิ้นสุดใหม่': item.newEndDate ? new Date(item.newEndDate).toLocaleDateString('th-TH') : '-',
          'เงินเดือนใหม่': item.newSalary || '-',
          'วันที่สร้าง': new Date(item.createdAt).toLocaleDateString('th-TH'),
          'ไฟล์แนบ': item.attachments?.length || 0
        })));
      }
      
    } else {
      console.error('❌ เกิดข้อผิดพลาด:', result.error);
    }
    
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการทดสอบ:', error);
  }
};

// ทดสอบดึงข้อมูลตามสถานะ
const testContractRenewalByStatus = async (status) => {
  try {
    console.log(`🔄 กำลังทดสอบการดึงข้อมูลสถานะ: ${status}...`);
    
    const url = status === 'all' 
      ? 'http://localhost:3000/api/contract-renewals' 
      : `http://localhost:3000/api/contract-renewals?status=${status}`;
    
    const response = await fetch(url);
    const result = await response.json();
    
    if (result.success) {
      console.log(`✅ ดึงข้อมูลสถานะ ${status} สำเร็จ!`);
      console.log(`📊 จำนวนข้อมูล: ${result.data.length}`);
      
      if (result.data.length > 0) {
        console.table(result.data.map((item, index) => ({
          '#': index + 1,
          'ชื่อ-นามสกุล': item.employeeName,
          'สถานะ': item.status,
          'วันที่สร้าง': new Date(item.createdAt).toLocaleDateString('th-TH')
        })));
      }
      
    } else {
      console.error('❌ เกิดข้อผิดพลาด:', result.error);
    }
    
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการทดสอบ:', error);
  }
};

// ทดสอบดึงข้อมูลรายละเอียด
const testContractRenewalDetails = async (id) => {
  try {
    console.log(`🔄 กำลังทดสอบการดึงข้อมูลรายละเอียด ID: ${id}...`);
    
    const response = await fetch(`http://localhost:3000/api/contract-renewals/${id}`);
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ ดึงข้อมูลรายละเอียดสำเร็จ!');
      console.log('📋 ข้อมูลรายละเอียด:', result.data);
    } else {
      console.error('❌ เกิดข้อผิดพลาด:', result.error);
    }
    
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการทดสอบ:', error);
  }
};

// ฟังก์ชันหลักสำหรับทดสอบ
const runTests = async () => {
  console.log('🚀 เริ่มต้นการทดสอบ ContractRenewal API...\n');
  
  // ทดสอบดึงข้อมูลทั้งหมด
  await testContractRenewalAPI();
  console.log('\n' + '='.repeat(50) + '\n');
  
  // ทดสอบดึงข้อมูลตามสถานะ
  await testContractRenewalByStatus('PENDING');
  console.log('\n' + '='.repeat(50) + '\n');
  
  await testContractRenewalByStatus('APPROVED');
  console.log('\n' + '='.repeat(50) + '\n');
  
  await testContractRenewalByStatus('REJECTED');
  console.log('\n' + '='.repeat(50) + '\n');
  
  console.log('✅ การทดสอบเสร็จสิ้น!');
};

// รันการทดสอบ
runTests();
