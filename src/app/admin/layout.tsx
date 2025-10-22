'use client';

import React, { useState } from 'react';
import {
  Button,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection
} from '@heroui/react';
import {
  HomeIcon,
  BellIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  DocumentCheckIcon,
  CogIcon,
  ClipboardDocumentListIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      key: 'dashboard',
      title: 'หน้าแรก',
      icon: HomeIcon,
      href: '/admin'
    },
    {
      key: 'applicants',
      title: 'จัดการผู้สมัคร',
      icon: ClipboardDocumentListIcon,
      href: '/admin/applicants'
    },
    {
      key: 'departments',
      title: 'การประกาศรับสมัคร',
      icon: BuildingOfficeIcon,
      href: '/departments'
    },
    {
      key: 'members',
      title: 'การจัดการสมาชิก',
      icon: UserGroupIcon,
      href: '/admin/members'
    },
    {
      key: 'contract-renewal',
      title: 'การจัดการต่อสัญญา',
      icon: DocumentCheckIcon,
      href: '/admin/contract-renewal'
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-md border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:bg-white lg:backdrop-blur-none`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div className={`transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
              <h2 className="text-lg font-semibold text-gray-800">Admin Panel</h2>
              <p className="text-xs text-gray-500">ระบบจัดการ</p>
            </div>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="p-2">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 hover:text-gray-900"
              >
                <item.icon className="w-5 h-5" />
                <span className={`transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
                  {item.title}
                </span>
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <Bars3Icon className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-lg lg:text-xl font-semibold text-gray-800">ระบบจัดการ</h1>
            </div>
              
            <div className="flex items-center gap-2 lg:gap-4">
                {/* Notifications */}
                <Button
                  isIconOnly
                  variant="light"
                  className="relative"
                  size="sm"
                >
                  <BellIcon className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 lg:w-3 lg:h-3 bg-red-500 rounded-full"></span>
                </Button>

                {/* User Menu */}
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <Button variant="light" className="flex items-center gap-2">
                      <Avatar
                        size="sm"
                        name="Admin"
                        className="w-6 h-6 lg:w-8 lg:h-8"
                      />
                      <span className="hidden lg:block text-sm font-medium">ผู้ดูแลระบบ</span>
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    <DropdownSection title="บัญชี">
                      <DropdownItem
                        key="profile"
                        startContent={<UserCircleIcon className="w-4 h-4" />}
                      >
                        โปรไฟล์
                      </DropdownItem>
                      <DropdownItem
                        key="settings"
                        startContent={<CogIcon className="w-4 h-4" />}
                      >
                        ตั้งค่า
                      </DropdownItem>
                    </DropdownSection>
                    <DropdownSection>
                      <DropdownItem
                        key="logout"
                        className="text-red-600"
                        startContent={<ArrowRightOnRectangleIcon className="w-4 h-4" />}
                      >
                        ออกจากระบบ
                      </DropdownItem>
                    </DropdownSection>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
          </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
