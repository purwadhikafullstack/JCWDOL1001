import React, { useEffect } from 'react'
import { HiOutlineClipboardDocumentList, HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineMapPin, HiOutlinePower, HiOutlineUser } from 'react-icons/hi2';
import Button from '../../components/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/auth/slices';

export default function UserSidebar({ profile, user, setMobileContextActive, ongoingTransactions }) {
  const { context } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const menu = [
    {
      title : "Profil",
      context : "profile",
      path : "/user/profile",
      notification: null,
      icon : <HiOutlineUser className="block text-xl"/>
    },
    {
      title : "Alamat",
      context : "address",
      path : "/user/address",
      notification: null,
      icon : <HiOutlineMapPin className="block text-xl"/>
    },
    {
      title : "Transaksi",
      context : "transaction",
      path : "/user/transaction",
      notification: ongoingTransactions?.totalTransactions,
      icon : <HiOutlineClipboardDocumentList className="block text-xl"/>
    },
    {
      title : "Email",
      context : "email",
      path : "/user/email",
      notification: null,
      icon : <HiOutlineEnvelope className="block text-xl"/>
    },
    {
      title : "Password",
      context : "password",
      path : "/user/password",
      notification: null,
      icon : <HiOutlineLockClosed className="block text-xl"/>
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
          <div className="flex items-center gap-4 border-b-2 pb-4">
            <div className="h-12 w-12 rounded-full bg-primary">
              <img src="" alt="" /> 
            </div>
            <h3>{profile.name}</h3>
          </div>

          <div className="border-b-2 py-4 flex gap-2">
            {user.status === 0 &&
              <Button
                isButton
                isPrimary
                isBLock
              onClick={() => navigate("/verify")}
                title="Verify Account"
                className="lg:hidden"
              />
            }

            <Button
              isButton
              isBLock
              isPrimaryOutline
              onClick={() => navigate("/upload-recipe")}
              title="Unggah Resep"
              />
          </div>

          <h3 className="title lg:hidden mt-4">Pengaturan</h3>
          <div className="flex flex-col gap-6 lg:gap-4 mt-2 lg:mt-4 overflow-auto">
            {menu.map((menu, index) => (
            <Button
              key={index}
              isLink
              path={menu.path}
              className={`flex relative items-center gap-3 ${menu.context === context ? "lg:text-primary lg:font-semibold" : ""}`}
              onClick={() => setMobileContextActive(true)}
              >
              {menu.icon}
              <span>{menu.title}</span>

              {menu.notification > 0 &&
                  <span className="absolute w-4 h-4 flex justify-center items-center rounded-full bg-danger right-0 text-white group-hover:right-1 text-xs">{menu.notification}</span>
              }
            </Button>
            ))}

            <Button 
              isLink
              className={`items-center gap-3 flex`}
              onClick={() => dispatch(logout())}
            >
              <HiOutlinePower className="text-xl"/>
              <span>Keluar</span>
            </Button>

          </div>
        </div>
  )
}
