import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import UserNavMenuItems from "./user.nav.menu.items"
import Button from "../Button"
import { FaCartShopping } from "react-icons/fa6"
import { HiChevronRight } from "react-icons/hi2"
import { logout, resendOtp } from "../../store/slices/auth/slices"
import { HiMiniChatBubbleOvalLeftEllipsis } from "react-icons/hi2"
import { totalProductCart } from "../../store/slices/cart/slices"


export default function UserNavMenu({
  isLogin,
  user,
  handleShowModal,
  ongoingTransactions,
  // total
}) {
  const {total}= useSelector(state=>{
    return {
      total : state?.cart?.total,
    }
  })

  const navigate = useNavigate()

  const dispatch = useDispatch()

  const [isMenuVisible, setIsMenuVisible] = useState(false)

  const isAccountVerified = user.status === 0 && isLogin

  const onClickKeluar = () => {
    dispatch(logout()).finally(() => {
      navigate("/")
    });
    
  }

  useEffect(()=>{
    setIsMenuVisible(false)
  }, [user])

  return (
    <div className={`nav-menu-wrapper justify-end `} >
      <div className={`nav-menu w-full ${ isLogin ? "border-primary/70 pr-8 lg:border-r-[1px]  mr-8" :"" }`} >
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
            
          : 
            <UserNavMenuItems user={user} isLogin={isLogin} ongoingTransactions={ongoingTransactions}/>
        }
      </div>

      {
        isLogin ? 
          <div className="flex items-center gap-4 md:gap-8">
            <div className="relative flex gap-4">
              <Button isLink path="/cart" className={""} >
                <FaCartShopping className="fill-primary text-2xl" />
                {total > 0 &&
                  <span className={`absolute -right-2 -top-2 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-danger text-[10px] text-white`}>
                  {total}
                  </span>
                }
              </Button>
              
            </div>

            <div
              className={`profile-img-wrapper relative row-start-2 flex w-full items-center gap-2 ${isAccountVerified ? "lg:border lg:border-danger lg:rounded-full lg:p-0.5" : null }`}
              onMouseOver={() => setIsMenuVisible(true)}
              onMouseLeave={() => setIsMenuVisible(false)}
              >
              <div className="nav-profile-img hidden aspect-square w-8 cursor-pointer self-center overflow-hidden rounded-full md:mb-0 lg:block" >
                {user?.profile?.profilePicture ?
                  <img
                    src={process.env.REACT_APP_CLOUDINARY_BASE_URL + user?.profile?.profilePicture}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                :
                  <div className="flex justify-center items-center bg-primary w-full h-full text-white font-semibold text-xl">
                    {user?.profile.name.charAt(0)}
                  </div>
                }

                {ongoingTransactions > 0 &&
                  <span className="absolute w-4 h-4 flex justify-center items-center rounded-full bg-danger -right-2 top-0 text-white group-hover:right-1 text-[12px]">
                    {ongoingTransactions}
                  </span>
                }
              </div>

              <AnimatePresence>
                {
                  isMenuVisible &&
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
                        <div className="" onClick={() => navigate("/user/profile")}>
                          <div className="flex w-72 cursor-pointer items-center gap-2 border-b-2 pb-4">
                            <div className="h-12 w-12 overflow-hidden rounded-full">
                              {user?.profile?.profilePicture ?
                                <img
                                  src={process.env.REACT_APP_CLOUDINARY_BASE_URL + user?.profile?.profilePicture}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              :
                                <div className="flex justify-center items-center bg-primary w-full h-full text-white font-semibold text-xl">
                                  {user?.profile.name.charAt(0)}
                                </div>
                              }
                            </div>
                            <div className="">
                              <h3>{user.profile.name}</h3>
                              <p className="text-sm font-normal text-slate-500">
                                Profil & Pengaturan
                              </p>
                              <p className="text-xs text-danger">Silahkan lakukan verifikasi</p>
                            </div>
                            <div className="ml-auto flex h-8 w-8 items-center justify-center rounded-full shadow-md">
                              <HiChevronRight className="text-dark" />
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 pt-4">
                          <Button
                            isLink
                            path="/user/transaction"
                            className="hover:text-primary flex justify-between"
                          >
                            <span>Transaksi</span>
                            {ongoingTransactions > 0 &&
                              <span className={`flex h-[18px] w-[18px] items-center justify-center rounded-full bg-danger text-[10px] text-white`}>
                              {ongoingTransactions}
                              </span>
                            }
                          </Button>
                          <Button
                            isLink
                            path="/upload-recipe"
                            title="Unggah Resep"
                            className="hover:text-primary"
                          />
                          <Button
                            className="block w-full text-dark duration-200 hover:text-primary lg:w-[52px] lg:group-hover:w-full"
                            title="Keluar"
                            onClick={onClickKeluar}
                          />
                        </div>
                      </div>
                    </motion.div>
                }
              </AnimatePresence>
            </div>
          </div>
        :""
      }
    </div>
  );
}
