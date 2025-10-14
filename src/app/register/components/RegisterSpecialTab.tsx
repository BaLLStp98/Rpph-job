import React from 'react';
import { Card, CardHeader, CardBody } from '@heroui/react';
import { UserIcon } from '@heroicons/react/24/outline';

export default function RegisterSpecialTab() {
  return (
    <Card className="shadow-xl border-0">
      <CardHeader className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-rose-400/20"></div>
        <div className="relative flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <UserIcon className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-semibold">ทักษะพิเศษ</h2>
        </div>
      </CardHeader>
      <CardBody className="p-8">
        <div className="text-center py-8">
          <UserIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">ทักษะพิเศษ</h3>
          <p className="text-gray-500">ข้อมูลทักษะพิเศษจะแสดงที่นี่</p>
        </div>
      </CardBody>
    </Card>
  );
}


