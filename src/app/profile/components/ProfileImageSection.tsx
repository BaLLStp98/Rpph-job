'use client'

import { useState, useRef } from 'react'
import { Card, CardBody, Button, Avatar } from '@heroui/react'
import { CameraIcon, TrashIcon } from '@heroicons/react/24/outline'

interface ProfileImageSectionProps {
  profileImage: string | null
  profileData: any
  editing: boolean
  onImageChange: (imageUrl: string) => void
  onImageDelete: () => void
}

export default function ProfileImageSection({
  profileImage,
  profileData,
  editing,
  onImageChange,
  onImageDelete
}: ProfileImageSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !profileData?.id) return
    
    const form = new FormData()
    form.append('file', file)
    form.append('applicationId', profileData.id)
    
    try {
      const res = await fetch('/api/profile-image/upload', { method: 'POST', body: form })
      const data = await res.json()
      if (res.ok && data.profileImage) {
        onImageChange(`/api/image?file=${data.profileImage}`)
      }
    } catch (error) {
      console.error('Error uploading image:', error)
    }
  }

  const handleImageDelete = async () => {
    if (!profileData?.id) return
    if (!confirm('คุณต้องการลบรูปภาพโปรไฟล์หรือไม่?')) return
    
    try {
      const fileName = profileImage?.split('/').pop()
      const res = await fetch('/api/profile-image/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName, applicationId: profileData.id })
      })
      
      if (res.ok) {
        onImageDelete()
      }
    } catch (error) {
      console.error('Error deleting image:', error)
    }
  }

  return (
    <Card className="w-full">
      <CardBody className="text-center p-6">
        <div className="relative inline-block">
          <Avatar
            src={profileImage || '/image/LOGO-LOGIN.png'}
            alt="Profile Image"
            className="w-32 h-32 mx-auto mb-4"
            classNames={{
              base: "w-32 h-32",
              img: "w-full h-full object-cover"
            }}
          />
          {editing && (
            <div className="absolute bottom-0 right-0 flex gap-2">
              <Button
                isIconOnly
                size="sm"
                color="primary"
                variant="solid"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-full"
              >
                <CameraIcon className="w-4 h-4" />
              </Button>
              {profileImage && (
                <Button
                  isIconOnly
                  size="sm"
                  color="danger"
                  variant="solid"
                  onClick={handleImageDelete}
                  className="rounded-full"
                >
                  <TrashIcon className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {profileData?.prefix} {profileData?.firstName} {profileData?.lastName}
        </h2>
        <p className="text-gray-600 mb-4">{profileData?.lineDisplayName}</p>
        
        {editing && (
          <p className="text-sm text-gray-500">
            คลิกที่ไอคอนกล้องเพื่ออัปโหลดรูปภาพใหม่
          </p>
        )}
      </CardBody>
    </Card>
  )
}
