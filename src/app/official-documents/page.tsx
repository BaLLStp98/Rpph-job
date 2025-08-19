'use client';
import React, { useState } from 'react';
import { Button, Pagination } from '@heroui/react';
import { ChevronLeftIcon, ChevronRightIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import Page1Application from './page1-application/page';
import Page2Officials from './page2-officials/page';
import Page3Applicant from './page3-applicant/page';
import Page4Additional from './page4-additional/page';

export default function OfficialDocuments() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 4;

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 1:
        return <Page1Application />;
      case 2:
        return <Page2Officials />;
      case 3:
        return <Page3Applicant />;
      case 4:
        return <Page4Additional />;
      default:
        return <Page1Application />;
    }
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case 1:
        return 'หน้า 1 - ใบสมัคร';
      case 2:
        return 'หน้า 2 - ข้อมูลสิทธิการรักษา';
      case 3:
        return 'หน้า 3 - ข้อมูลส่วนตัวและประวัติการทำงาน';
      case 4:
        return 'หน้า 4 - ข้อมูลตามเอกสารทางการ';
      default:
        return 'หน้า 1 - ใบสมัคร';
    }
  };

  // ฟังก์ชันสำหรับสร้างปุ่มนำทางแต่ละหน้า
  const renderPageButton = (pageNumber: number) => {
    const isActive = currentPage === pageNumber;
    return (
      <Button
        key={pageNumber}
        color={isActive ? "primary" : "default"}
        variant={isActive ? "solid" : "ghost"}
        className={`min-w-[60px] h-10 ${
          isActive 
            ? 'bg-blue-600 text-white shadow-md' 
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        onClick={() => handlePageChange(pageNumber)}
      >
        {pageNumber}
      </Button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600 rounded-xl">
                <DocumentTextIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">เอกสารทางการ</h1>
                <p className="text-gray-600">ใบสมัครเข้ารับราชการเป็นบุคคลภายนอกช่วยปฏิบัติราชการ</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">หน้า {currentPage} จาก {totalPages}</p>
              <p className="text-lg font-semibold text-gray-700">{getPageTitle()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                color="primary"
                variant="ghost"
                startContent={<ChevronLeftIcon className="w-5 h-5" />}
                onClick={handlePrevPage}
                isDisabled={currentPage === 1}
                className={currentPage === 1 ? 'opacity-50' : 'hover:bg-blue-50'}
              >
                หน้าก่อนหน้า
              </Button>
              
              <Button
                color="primary"
                variant="ghost"
                endContent={<ChevronRightIcon className="w-5 h-5" />}
                onClick={handleNextPage}
                isDisabled={currentPage === totalPages}
                className={currentPage === totalPages ? 'opacity-50' : 'hover:bg-blue-50'}
              >
                หน้าถัดไป
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">ไปที่หน้า:</span>
              
              {/* ปุ่มนำทางแบบกำหนดเอง */}
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => 
                  renderPageButton(pageNumber)
                )}
              </div>
              
              {/* Pagination component ต้นฉบับ (สำรอง) */}
              <div className="hidden">
                <Pagination
                  total={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  showControls
                  size="sm"
                  color="primary"
                  variant="bordered"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="flex-1">
        {renderCurrentPage()}
      </div>
    </div>
  );
}


