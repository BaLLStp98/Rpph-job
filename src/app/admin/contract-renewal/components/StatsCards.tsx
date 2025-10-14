'use client';

import React from 'react';
import { Card, CardBody } from '@heroui/react';
import {
  DocumentCheckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface StatsCardsProps {
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    expired: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardBody className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm lg:text-base">ทั้งหมด</p>
              <p className="text-2xl lg:text-3xl font-bold">{stats.total}</p>
            </div>
            <DocumentCheckIcon className="w-6 h-6 lg:w-8 lg:h-8 text-blue-200" />
          </div>
        </CardBody>
      </Card>

      <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
        <CardBody className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm lg:text-base">รอดำเนินการ</p>
              <p className="text-2xl lg:text-3xl font-bold">{stats.pending}</p>
            </div>
            <ClockIcon className="w-6 h-6 lg:w-8 lg:h-8 text-yellow-200" />
          </div>
        </CardBody>
      </Card>

      <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <CardBody className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm lg:text-base">อนุมัติ</p>
              <p className="text-2xl lg:text-3xl font-bold">{stats.approved}</p>
            </div>
            <CheckCircleIcon className="w-6 h-6 lg:w-8 lg:h-8 text-green-200" />
          </div>
        </CardBody>
      </Card>

      <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
        <CardBody className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm lg:text-base">ปฏิเสธ</p>
              <p className="text-2xl lg:text-3xl font-bold">{stats.rejected}</p>
            </div>
            <XCircleIcon className="w-6 h-6 lg:w-8 lg:h-8 text-red-200" />
          </div>
        </CardBody>
      </Card>

      <Card className="bg-gradient-to-r from-gray-500 to-gray-600 text-white">
        <CardBody className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-100 text-sm lg:text-base">หมดอายุ</p>
              <p className="text-2xl lg:text-3xl font-bold">{stats.expired}</p>
            </div>
            <CalendarIcon className="w-6 h-6 lg:w-8 lg:h-8 text-gray-200" />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
