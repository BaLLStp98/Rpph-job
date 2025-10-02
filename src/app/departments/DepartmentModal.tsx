"use client";
import { ReactNode } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react';

type DepartmentModalMode = 'create' | 'edit';

interface DepartmentModalProps {
  mode: DepartmentModalMode;
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  headerIcon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

export default function DepartmentModal(props: DepartmentModalProps) {
  const { mode, isOpen, onClose, title, subtitle, headerIcon, children, footer } = props;

  return (
    <Modal 
      isOpen={isOpen}
      onClose={onClose}
      size="4xl"
      classNames={{
        backdrop: "bg-white/80 backdrop-blur-sm",
        base: "bg-white shadow-2xl max-h-[90vh]",
        header: "bg-white",
        body: "bg-white overflow-y-auto max-h-[60vh]",
        footer: "bg-white"
      }}
      placement="center"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            {headerIcon}
            <div>
              <h2 className="text-xl font-semibold">{title}</h2>
              {subtitle ? <p className="text-sm text-gray-600">{subtitle}</p> : null}
            </div>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            {children}
          </div>
        </ModalBody>
        <ModalFooter>
          {footer}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}


