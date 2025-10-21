'use client';

import React from 'react';
import { Card, CardHeader, CardBody } from '@heroui/react';

interface DepartmentData {
  department: string;
  count: number;
  color: string;
}

interface DepartmentChartProps {
  data: DepartmentData[];
  className?: string;
}

export default function DepartmentChart({ data, className = '' }: DepartmentChartProps) {
  // หาจำนวนสูงสุดเพื่อคำนวณเปอร์เซ็นต์
  const maxCount = Math.max(...data.map(item => item.count));
  
  return (
    <Card className={`${className}`}>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-800">จำนวนผู้สมัครตามฝ่าย</h3>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          {data.map((item, index) => {
            const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
            
            return (
              <div key={index} className="flex items-center space-x-4">
                {/* ชื่อฝ่าย */}
                <div className="w-32 text-sm font-medium text-gray-700 truncate">
                  {item.department}
                </div>
                
                {/* กราฟแท่ง */}
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ease-out ${item.color}`}
                    style={{ width: `${percentage}%` }}
                  />
                  
                  {/* จำนวนผู้สมัคร */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-semibold text-gray-800">
                      {item.count} คน
                    </span>
                  </div>
                </div>
                
                {/* เปอร์เซ็นต์ */}
                <div className="w-16 text-sm text-gray-600 text-right">
                  {percentage.toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>
        
        {/* สรุปข้อมูล */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">รวมทั้งหมด:</span>
              <span className="ml-2 font-semibold text-gray-800">
                {data.reduce((sum, item) => sum + item.count, 0)} คน
              </span>
            </div>
            <div>
              <span className="text-gray-600">จำนวนฝ่าย:</span>
              <span className="ml-2 font-semibold text-gray-800">
                {data.length} ฝ่าย
              </span>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
