import React, { useEffect } from 'react'
import { HiOutlineClipboardDocumentList, HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineMapPin, HiOutlinePower, HiOutlineUser } from 'react-icons/hi2';
import { FaPowerOff } from "react-icons/fa6";
import Button from '../../components/Button';
import { useNavigate, useParams } from 'react-router-dom';

export default function ProfileCard({ profile, user }) {
  const { context } = useParams()
  const navigate = useNavigate()
  const menu = [
    {
      title : "Profil",
      context : "profile",
      path : "/user/profile",
      icon : <HiOutlineUser className="hidden lg:block text-xl"/>
    },
    {
      title : "Alamat",
      context : "address",
      path : "/user/address",
      icon : <HiOutlineMapPin className="hidden lg:block text-xl"/>
    },
    {
      title : "Transaksi",
      context : "transaction",
      path : "/user/transaction",
      icon : <HiOutlineClipboardDocumentList className="hidden lg:block text-xl"/>
    },
    {
      title : "Email",
      context : "email",
      path : "/user/email",
      icon : <HiOutlineEnvelope className="hidden lg:block text-xl"/>
    },
    {
      title : "Password",
      context : "password",
      path : "/user/password",
      icon : <HiOutlineLockClosed className="hidden lg:block text-xl"/>
    },
  ]

  useEffect(() => {
    const allowedContext = menu.find((item) => item.context === context);

    if (!allowedContext) {
      return navigate("/not-found", { replace: true });
    }
  }, [context]);

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
              className={`lg:hidden flex flex-col items-center gap-3 text-danger`}
            >
              <FaPowerOff className="text-xl"/>
              <span className="text-xs font-semibold">Keluar</span>
            </Button>
          </div>

          <div className="border-b-2 py-4 flex gap-2">
            {user.status === 0 &&
              <Button
                isButton
                isPrimary
                isBLock
                title="Verify Account"
                className="lg:hidden"
              />
            }

            <Button
              isButton
              isBLock
              isPrimaryOutline
              title="Unggah Resep"
              />
          </div>

          <h3 className="title lg:hidden mt-4">Pengaturan</h3>
          <div className="flex lg:flex-col gap-6 lg:gap-4 mt-2 lg:mt-4 overflow-auto">
            {menu.map((menu, index) => (

              <Button 
              isLink
              path={menu.path}
              className={`flex items-center gap-3 ${menu.context === context ? "text-primary font-semibold" : ""}`}
              >
              {menu.icon}
              <span>{menu.title}</span>
            </Button>
            ))}

            <Button 
              isLink
              className={`items-center gap-3 hidden lg:flex`}
            >
              <HiOutlinePower className="text-xl"/>
              <span>Keluar</span>
            </Button>

          </div>
        </div>
  )
}
