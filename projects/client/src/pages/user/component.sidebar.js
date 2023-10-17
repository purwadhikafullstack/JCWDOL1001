import React, { useEffect, useState } from 'react'
import { HiOutlineClipboardDocumentList, HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineMapPin, HiOutlinePower, HiOutlineUser, HiOutlineChatBubbleOvalLeftEllipsis } from 'react-icons/hi2';
import Button from '../../components/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout, resendOtp } from '../../store/slices/auth/slices';
import { toast } from 'react-toastify';

export default function UserSidebar({ profile, user, setMobileContextActive, ongoingTransactions, verify, setVerify }) {
  const { context } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const onClickVerified = ()=>{
    dispatch(resendOtp({email : user?.email}))
    setVerify(true)
  }
  
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
    {
      title : "QnA",
      context : "qna",
      path : "/user/qna",
      notification: null,
      icon : <HiOutlineChatBubbleOvalLeftEllipsis className="block text-xl"/>
    },
  ]

  const [isToastVisible, setIsToastVisible] = useState(false)

  const handleUnverifiedUser = ()=>{
    toast.error("Akun belum terverifikasi")
    setIsToastVisible(true)
    setTimeout(() => {
      setIsToastVisible(false)
    }, 2000)
  }

  const handleButtonUpload = () => {
    user?.status ===0 ?  handleUnverifiedUser()
    : navigate("/upload-recipe")
  }

  useEffect(() => {
    const allowedContext = menu.find((item) => item.context === context);

    if (!allowedContext) {
      return navigate("/not-found", { replace: true });
    }
  }, [context]);

  return (
    <div className="lg:col-span-1 border rounded-lg p-4 shadow-md w-full h-fit">
          <div className="flex items-center gap-4 border-b-2 pb-4">
            <div className="h-12 w-12 rounded-full overflow-hidden flex items-center justify-center">
              {user?.profile?.profilePicture ?
              <img src={process.env.REACT_APP_CLOUDINARY_BASE_URL + user?.profile?.profilePicture} alt="" /> 
              :
              <div className="flex justify-center items-center bg-primary w-full h-full text-white font-semibold text-xl">
                {user?.profile.name.charAt(0)}
              </div>
            }
            </div>
            <h3>{profile.name}</h3>
          </div>

          <div className="border-b-2 py-4 flex flex-col gap-2">
            {user?.status === 0 &&
              <Button
                isButton
                isPrimary
                isBLock
                onClick={onClickVerified}
                title={verify ? "Email Verifikasi Telah Dikirim" : "Verifikasi Akun"}
                isDisabled={verify}
              />
            }

            <Button
              isDisabled={isToastVisible}
              isButton
              isBLock
              isPrimaryOutline
              onClick={handleButtonUpload}
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
              className={`items-center gap-3 flex`}
              onClick={() => dispatch(logout()).finally(() => navigate("/"))}
            >
              <HiOutlinePower className="text-xl"/>
              <span>Keluar</span>
            </Button>

          </div>
        </div>
  )
}
