'use client';

import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  Avatar
} from '@heroui/react';
import { EyeIcon } from '@heroicons/react/24/outline';

interface ContractData {
  id: string;
  employeeName: string;
  position: string;
  department: string;
  currentContractEnd: string;
  newContractStart: string;
  newContractEnd: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  createdAt: string;
  updatedAt: string;
}

interface ContractsTableProps {
  contracts: ContractData[];
  onViewDetails: (contract: ContractData) => void;
}

export default function ContractsTable({ contracts, onViewDetails }: ContractsTableProps) {
  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      pending: 'รอดำเนินการ',
      approved: 'อนุมัติ',
      rejected: 'ปฏิเสธ',
      expired: 'หมดอายุ'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      pending: 'warning',
      approved: 'success',
      rejected: 'danger',
      expired: 'default'
    };
    return colorMap[status] || 'default';
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">รายการต่อสัญญา</h2>
      </CardHeader>
      <CardBody>
        <Table aria-label="Contracts table">
          <TableHeader>
            <TableColumn>ชื่อ-นามสกุล</TableColumn>
            <TableColumn>ตำแหน่ง</TableColumn>
            <TableColumn>แผนก</TableColumn>
            <TableColumn>สัญญาเดิม</TableColumn>
            <TableColumn>สัญญาใหม่</TableColumn>
            <TableColumn>สถานะ</TableColumn>
            <TableColumn>การดำเนินการ</TableColumn>
          </TableHeader>
          <TableBody>
            {contracts.map((contract) => (
              <TableRow key={contract.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar
                      name={contract.employeeName}
                      size="sm"
                    />
                    <div>
                      <p className="font-medium">{contract.employeeName}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-medium">{contract.position}</p>
                </TableCell>
                <TableCell>
                  <p className="text-gray-600">{contract.department}</p>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-gray-600">
                    {new Date(contract.currentContractEnd).toLocaleDateString('th-TH')}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-gray-600">
                    {new Date(contract.newContractStart).toLocaleDateString('th-TH')} - {new Date(contract.newContractEnd).toLocaleDateString('th-TH')}
                  </p>
                </TableCell>
                <TableCell>
                  <Chip
                    color={getStatusColor(contract.status) as any}
                    variant="flat"
                    size="sm"
                  >
                    {getStatusText(contract.status)}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      color="primary"
                      variant="flat"
                      startContent={<EyeIcon className="w-4 h-4" />}
                      onPress={() => onViewDetails(contract)}
                    >
                      ดูรายละเอียด
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
}
