import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Modal from "../Modal"
import UserNavMenu from "./user.nav.menu"
import AdminNavMenu from "./admin.nav.menu";
import { useDispatch } from "react-redux";

export default function Navbar ({ user, isLogin, setIsLogin }) {
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

    useEffect(()=>{},[isLogin])

	return (
		<div>
            <AnimatePresence>
                <motion.div
                    initial={{ translateY: -50, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    animate={{ translateY: 0, opacity: 1 }}
                    className={`nav ${user.role === 1 ? "z-20" : "z-[999]"}`}
                >
                    <div className="navbar container flex">
                        <div className="lg:block">
                            <a 
                                href="/" 
                                className="flex items-center gap-2 text-2xl font-bold tracking-tighter text-dark"
                            >
                                APOTECH
                            </a>
                        </div>

                        {user.role === 1 &&
                            <AdminNavMenu
                                isLogin={isLogin}
                                setIsLogin={setIsLogin}
                                isSidebarActive={isSidebarActive}
                                setIsSidebarActive={setIsSidebarActive}
                                user={user}
                            />
                        }

                        {(!user.role || user.role === 2) && (
                            <UserNavMenu
                                isLogin={isLogin}
                                setIsLogin={setIsLogin}
                                handleShowModal={handleShowModal}
                                user={user}
                            />
                        )}

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
