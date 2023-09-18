import React from 'react'
import { HiOutlineClipboardDocumentList, HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineMapPin, HiOutlinePower, HiOutlineUser } from 'react-icons/hi2';
import { FaPowerOff } from "react-icons/fa6";
import Button from '../../../components/Button';

export default function ProfileEmailCard({ profile }) {
  return (
    <div className="lg:col-span-1 border rounded-lg p-4 shadow-md w-full h-fit">
          <div className="flex justify-between border-b-2 pb-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary">
                <img src="" alt="" /> 
              </div>
              <h3>{profile.name}</h3>
            </div>

            <Button 
              isLink
              className={`lg:hidden flex flex-col items-center gap-1 text-danger`}
            >
              <FaPowerOff className="text-xl"/>
              <span className="text-xs font-semibold">Keluar</span>
            </Button>
          </div>

          <div className="border-b-2 py-4">
            <Button
              isButton
              isBLock
              isPrimaryOutline
              title="Unggah Resep"
              />
          </div>

          <h3 className="title lg:hidden mt-4">Pengaturan</h3>
          <div className="flex lg:flex-col gap-6 lg:gap-4 mt-2 lg:mt-4 overflow-auto">
            <Button 
              isLink
              className={`flex items-center gap-1`}
            >
              <HiOutlineUser className="hidden lg:block text-xl"/>
              <span>Profil</span>
            </Button>

            <Button 
              isLink
              className={`flex items-center gap-1`}
            >
              <HiOutlineMapPin className="hidden lg:block text-xl"/>
              <span>Alamat</span>
            </Button>

            <Button 
              isLink
              className={`flex items-center gap-1`}
            >
              <HiOutlineClipboardDocumentList className="hidden lg:block text-xl"/>
              <span>Transaksi</span>
            </Button>

            <Button 
              isLink
              className={`flex items-center gap-1 font-semibold text-primary`}
            >
              <HiOutlineEnvelope className="hidden lg:block text-xl"/>
              <span>Email</span>
            </Button>

            <Button 
              isLink
              className={`flex items-center gap-1`}
            >
              <HiOutlineLockClosed className="hidden lg:block text-xl"/>
              <span>Password</span>
            </Button>

            <Button 
              isLink
              className={`items-center gap-1 hidden lg:flex`}
            >
              <HiOutlinePower className="text-xl"/>
              <span>Keluar</span>
            </Button>

          </div>
        </div>
  )
}
