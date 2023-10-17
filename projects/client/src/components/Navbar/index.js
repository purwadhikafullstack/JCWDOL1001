import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Modal from "../Modal"
import UserNavMenu from "./user.nav.menu"
import AdminNavMenu from "./admin.nav.menu";
import { useDispatch } from "react-redux";
import Button from "../Button";
import { HiMiniChatBubbleOvalLeftEllipsis, HiMiniSquares2X2 } from "react-icons/hi2";
import { useLocation } from "react-router-dom";

export default function Navbar ({ user, isLogin, ongoingTransactions }) {
    const { pathname } = useLocation()
    const dispatch = useDispatch()

    const [isSidebarActive, setIsSidebarActive] = useState(false)
    const [showModal, setShowModal] = useState({ show: false, context: "" })
  
    const handleShowModal = (context) => {
        setShowModal({ show: true, context })
    }

    const handleCloseModal = () => {
        setShowModal({ show: false, context: "" })
    }

    useEffect(()=>{
        if (isSidebarActive) {
            document.body.style.overflow = "hidden"
        }

        if (!isSidebarActive) {
            document.body.style.overflow = "auto"
        }
    },[isSidebarActive])

	return (
		<div>
            <AnimatePresence>
                <motion.div
                    initial={{ translateY: -50, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    animate={{ translateY: 0, opacity: 1 }}
                    className={`nav ${user?.role === 1 ? "z-20" : "z-[999]"}`}
                >
                    <div className="navbar container flex justify-between">
                        <div className="lg:block">
                            <Button
                            isLink 
                                path="/" 
                                className="flex items-center gap-2 text-2xl font-bold tracking-tighter text-dark"
                            >
                            <span className="absolute block h-2 w-6 rounded-full bg-dark"></span>
                            <span className="absolute rotate-90 block h-2 w-6 rounded-full bg-primary"></span>
                            <span className="absolute block h-2 w-6 rounded-full bg-dark opacity-40"></span>
                            <span className="ml-8 font-poppins">Apotech</span>
                            </Button>
                        </div>

                        <div className="flex items-center">
                            {!user?.role &&
                            <div className="flex items-center gap-6">
                                <Button
                                    isLink
                                    path="/products"
                                    className={`flex flex-col items-center gap-1 text-xs ${ pathname === "/products" ? "text-primary" : "text-slate-500"}`}
                                >
                                    <HiMiniSquares2X2 className="text-2xl" />
                                    <span>Produk</span>
                                </Button>
                                
                                <Button
                                    isLink
                                    path="/qna"
                                    className={`flex flex-col items-center gap-1 text-xs md:mr-6 ${ pathname === "/qna" ? "text-primary" : "text-slate-500"}
                                    `}
                                >
                                    <HiMiniChatBubbleOvalLeftEllipsis className="text-2xl"/>
                                    QnA
                                </Button>
                            </div>
                            }

                        {user?.role === 1 &&
                            <AdminNavMenu
                                isSidebarActive={isSidebarActive}
                                setIsSidebarActive={setIsSidebarActive}
                                ongoingTransactions={ongoingTransactions}
                            />
                        }

                        {(!user?.role || user?.role === 2) && (
                            <UserNavMenu
                                isLogin={isLogin}
                                handleShowModal={handleShowModal}
                                user={user}
                                ongoingTransactions={ongoingTransactions}
                            />
                        )}
                        </div>
                    </div>

                    <Modal
                        showModal={showModal.show}
                        closeModal={handleCloseModal}
                        context={showModal.context}
                        title={
                            showModal.context === "login"
                                ? "Login"
                                : "Register"
                        }
                    />
                </motion.div>
            </AnimatePresence>
        </div>
	)
}
