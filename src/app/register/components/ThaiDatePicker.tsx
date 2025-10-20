'use client';

import React, { useState, useEffect } from 'react';

interface ThaiDatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const ThaiDatePicker: React.FC<ThaiDatePickerProps> = ({
  value,
  onChange,
  placeholder = "วัน เดือน ปี ไทย (เช่น 15 มกราคม 2567)",
  className = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer",
  disabled = false
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Helper functions
  const getThaiMonths = () => [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const getYearsArray = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    // เพิ่มช่วงปีให้มากขึ้น เพื่อรองรับการเลือกปีเก่าๆ (เช่น ปีเกิด)
    for (let i = currentYear - 80; i <= currentYear + 10; i++) {
      years.push(i);
    }
    return years;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      const thaiYear = date.getFullYear() + 543;
      const thaiMonth = date.toLocaleDateString('th-TH', { month: 'long' });
      const thaiDay = date.getDate();
      
      return `${thaiDay} ${thaiMonth} ${thaiYear}`;
    } catch (error) {
      return dateString;
    }
  };

  const handleDateSelect = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = (currentMonth.getMonth() + 1).toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    const isoDate = `${year}-${month}-${dayStr}`;
    
    onChange(isoDate);
    setShowPicker(false);
  };

  const handleMonthChange = (month: number) => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), month, 1));
  };

  const handleYearChange = (year: number) => {
    setCurrentMonth(prev => new Date(year, prev.getMonth(), 1));
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  // Initialize current month from value
  useEffect(() => {
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        setCurrentMonth(date);
      }
    }
  }, [value]);

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        value={formatDate(value)}
        onClick={() => !disabled && setShowPicker(!showPicker)}
        readOnly
        disabled={disabled}
        className={className}
      />
      {showPicker && !disabled && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 w-80">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-1 hover:bg-gray-100 rounded"
              >
                ←
              </button>
              <div className="flex items-center gap-2">
                <select
                  value={currentMonth.getMonth()}
                  onChange={(e) => handleMonthChange(parseInt(e.target.value))}
                  className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {getThaiMonths().map((month, index) => (
                    <option key={index} value={index}>
                      {month}
                    </option>
                  ))}
                </select>
                <select
                  value={currentMonth.getFullYear()}
                  onChange={(e) => handleYearChange(parseInt(e.target.value))}
                  className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {getYearsArray().map(year => (
                    <option key={year} value={year}>
                      {year + 543}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => navigateMonth('next')}
                className="p-1 hover:bg-gray-100 rounded"
              >
                →
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-1">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfMonth }, (_, i) => (
                <div key={`empty-${i}`} className="h-8"></div>
              ))}
              {days.map(day => (
                <button
                  key={day}
                  onClick={() => handleDateSelect(day)}
                  className="h-8 w-8 text-sm hover:bg-blue-100 rounded flex items-center justify-center"
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThaiDatePicker;