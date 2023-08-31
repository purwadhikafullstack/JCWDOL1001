import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Modal from "../Modal"
import NavMenu from "./menu"

export default function Navbar ({ user, isLogin, setIsLogin }) {
    const [showModal, setShowModal] = useState({ show: false, context: "" })
  
    const handleShowModal = (context) => {
        setShowModal({ show: true, context })
        document.body.style.overflow = "hidden"
    }

    const handleCloseModal = () => {
        setShowModal({ show: false, context: "" })
        document.body.style.overflow = "auto"
    }

	return (
		<div>
            <AnimatePresence>
                <motion.div
                    initial={{ translateY: -50, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    animate={{ translateY: 0, opacity: 1 }}
                    className="nav"
                >
                    <div className="navbar container flex">
                        <div className="lg:block ml-10">
                            <a 
                                href="/" 
                                className="flex items-center gap-2 text-2xl font-bold tracking-tighter text-dark"
                            >
                                LOGO
                            </a>
                        </div>

                        <div className={`nav-menu-wrapper justify-end  ${isLogin ? "lg:w-1/3" :""}`} >

                        <NavMenu
                            isLogin={isLogin}
                            setIsLogin={setIsLogin}
                            handleShowModal={handleShowModal}
                            user={user}
                        />
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
                    >
                    </Modal>
                </motion.div>
            </AnimatePresence>
        </div>
	)
}
