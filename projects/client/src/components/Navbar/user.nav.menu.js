import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import UserNavMenuItems from "./user.nav.menu.items"
import Button from "../Button"
import { FaCartShopping } from "react-icons/fa6"
import { HiChevronRight } from "react-icons/hi2"
import { logout, resendOtp } from "../../store/slices/auth/slices"

export default function UserNavMenu({
  isLogin,
  setIsLogin,
  user,
  handleShowModal,
}) {
  const navigate = useNavigate()

  const dispatch = useDispatch()

  const [isMenuVisible, setIsMenuVisible] = useState(false)

  const isAccountVerified = user.status === 0 && isLogin

  const [verify, setVerify] = useState(false)

  const onClickVerified = ()=>{
    dispatch(resendOtp({email : user.email}))
    setVerify(true)
  }

  const onClickKeluar = () => {
    dispatch(logout())
    setIsLogin(false)
    setIsMenuVisible(false)
  }

  useEffect(()=>{},[user])

  return (
    <div className={`nav-menu-wrapper justify-end  ${isLogin ? "lg:w-1/3" :""}`} >
      <div className={`nav-menu mr-8 w-full ${ isLogin ? "border-primary/70 pr-8 lg:border-r-[1px]" :"" }`} >
        {
          !isLogin ? 
            <div className="flex w-full gap-4 lg:w-fit">
              <Button
                isButton
                isPrimaryOutline
                title="Masuk"
                className="w-full"
                onClick={() => handleShowModal("login")}
              />
              <Button
                isButton
                isPrimary
                title="Daftar"
                className="w-full"
                onClick={() => handleShowModal("register")}
              />
            </div>
          : <UserNavMenuItems user={user} isLogin={isLogin} />
        }
      </div>

      {
        isLogin ? 
          <div className="flex items-center gap-4 md:gap-8">
            <div className="relative flex gap-4">
              

              <Button isLink path="/cart" className={""} >
                <FaCartShopping className="fill-primary text-2xl" />
                <span className={`absolute -right-2 -top-[8px] flex h-[18px] w-[18px] items-center justify-center rounded-full bg-danger text-[10px] text-white`}>
                  4
                </span>
              </Button>
              
            </div>

            <div
              className={`profile-img-wrapper relative row-start-2 flex w-full items-center gap-2 ${isAccountVerified ? "lg:border lg:border-danger lg:rounded-full lg:p-0.5" : null }`}
              onMouseOver={() => setIsMenuVisible(true)}
              onMouseLeave={() => setIsMenuVisible(false)}
              onClick={() => navigate("/profile")}
            >
              <div className="nav-profile-img hidden aspect-square w-8 cursor-pointer self-center overflow-hidden rounded-full bg-primary md:mb-0 lg:block" >
                <img
                  src=""
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>

              <AnimatePresence>
                {
                  isMenuVisible ?
                    <motion.div
                      initial={{
                        opacity: 0,
                        scale: 0,
                        originY: 0,
                        originX: 1,
                      }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.1 }}
                      exit={{
                        opacity: 0,
                        scale: 0,
                        originY: 0,
                        originX: 1,
                      }}
                      className="absolute right-0 top-full pt-2"
                    >
                      <div className="rounded-lg border bg-slate-100 px-6 py-4 shadow-lg">
                        <div className="" onClick={() => navigate("/profile")}>
                          <div className="flex w-72 cursor-pointer items-center gap-2 border-b-2 pb-4">
                            <div className="h-12 w-12 overflow-hidden rounded-full">
                              <img
                                src={user.profile.profilePicture}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="">
                              <h3>{user.profile.name}</h3>
                              <p className="text-sm font-normal text-slate-500">
                                Profil & Pengaturan
                              </p>
                            </div>
                            <div className="ml-auto flex h-8 w-8 items-center justify-center rounded-full shadow-md">
                              <HiChevronRight className="text-dark" />
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 pt-4">
                          <Button
                            isLink
                            title="Unggah Resep"
                            className="hover:text-primary"
                          />
                          <Button
                            isLink
                            title="Keluar"
                            className="hover:text-primary"
                            onClick={onClickKeluar}
                          />
                          <Button
                            isButton
                            isPrimary
                            isDisabled={verify}
                            onClick={onClickVerified}
                            className={`${ isAccountVerified && !verify? "text-primary w-auto" : " hidden"}`}
                          >
                            <span>Verify Account</span>
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  : ""
                }
              </AnimatePresence>
            </div>
          </div>
        :""
      }
    </div>
  );
}
