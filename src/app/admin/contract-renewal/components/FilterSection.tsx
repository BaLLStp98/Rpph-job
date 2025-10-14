'use client';

import React from 'react';
import { Card, CardBody, Input, Select, SelectItem } from '@heroui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface FilterSectionProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

export default function FilterSection({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange
}: FilterSectionProps) {
  return (
    <Card>
      <CardBody className="p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="ค้นหาด้วยชื่อ, ตำแหน่ง, หรือแผนก..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              startContent={<MagnifyingGlassIcon className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />}
              className="w-full"
              size="sm"
            />
          </div>
          <div className="flex gap-4">
            <Select
              placeholder="กรองตามสถานะ"
              selectedKeys={[statusFilter]}
              onSelectionChange={(keys) => onStatusFilterChange(Array.from(keys)[0] as string)}
              className="w-full lg:w-48"
              size="sm"
            >
              <SelectItem key="all">ทั้งหมด</SelectItem>
              <SelectItem key="pending">รอดำเนินการ</SelectItem>
              <SelectItem key="approved">อนุมัติ</SelectItem>
              <SelectItem key="rejected">ปฏิเสธ</SelectItem>
              <SelectItem key="expired">หมดอายุ</SelectItem>
            </Select>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
