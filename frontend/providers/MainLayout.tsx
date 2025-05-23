"use client";
import Modal from '@/app/components/modal/Modal'
import ProfileModal from '@/app/components/profile/ProfileModal';
import { useTasks } from '@/context/taskContext';
import React from 'react'

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {

  const {isEditing, profileModal} = useTasks();

  return (
    <div className="main-layout flex-1 bg-[#EDEDED] border-2 border-white rounded-[1.5rem] overflow-auto">
      {isEditing && <Modal />}
      {profileModal && <ProfileModal/>}
      {children}
    </div>
  )
}

export default MainLayout
