import { AnimatePresence, motion } from "framer-motion"
import { useEffect } from "react"
import { HiXMark } from "react-icons/hi2"

export default function Modal({ showModal, closeModal, children, title }) {
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === "Escape") {
        closeModal()
      }
    }

    document.addEventListener("keydown", handleEscapeKey)

    return () => {
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [closeModal, showModal])

  return (
    <AnimatePresence>
        {
          showModal ?
            <div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                exit={{ opacity: 0 }}
                onClick={closeModal}
                className="fixed inset-0 z-20 bg-black/70 backdrop-blur-sm dark:bg-slate-600/60"
              /> 

              <motion.div
                initial={{ translateY: -20, opacity: 0 }}
                animate={{ translateY: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                exit={{ translateY: -20, opacity: 0 }}
                className="fixed inset-0 z-20 m-auto h-fit w-4/5 rounded-lg bg-slate-100 p-6 shadow-lg dark:bg-slate-800 md:w-1/2 lg:w-1/3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">
                    {title}
                  </h3>

                  <span 
                    className="cursor-pointer" 
                    onClick={closeModal}
                  >
                    <HiXMark className="text-3xl" />
                  </span>

                </div>

                <div className="py-4">
                  {children}
                </div>
              </motion.div>
            </div>
          :""
        }
    </AnimatePresence>
  )
}
