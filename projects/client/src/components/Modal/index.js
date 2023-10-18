import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { HiArrowLongLeft, HiXMark } from "react-icons/hi2";
import LoginContext from "./context/login.context";
import RegisterContext from "./context/register.context";
import ForgotContext from "./context/forgot.password.context";
import Button from "../Button";
import { resetRegister } from "../../store/slices/auth/slices";
import { useDispatch, useSelector } from "react-redux";

export default function Modal({
  showModal,
  closeModal,
  title,
  context,
  children,
  disableOutside,
  fullWidth = false,
  halfWidth = false,
  showCloseButton = true,
  closeButtonText = false,
}) {
  const [login, setLogin] = useState(false);
  const [regist, setRegist] = useState(false);
  const [doneregist,setDoneRegist] = useState(false)
  const [forgot, setForgot] = useState(false);
  const [titleModal, setTitle] = useState("");
  const dispatch = useDispatch()
  const {isRegister} = useSelector(state =>{
    return {
        isRegister : state?.auth?.isRegister
    }
})
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === "Escape") {
        closeModal();
        setTitle("");
      }
    };
    console.log(isRegister)
    dispatch(resetRegister())

    context === "login" ? setLogin(true) :  setRegist(true); 

    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    
    };
    
    
  }, [closeModal, showModal]);

  const modalBodyClassName = []

  fullWidth === true && modalBodyClassName.push("w-full h-full")

  halfWidth === true && modalBodyClassName.push("lg:w-3/4 md:w-3/4 w-[95%] h-fit rounded-lg")

  !fullWidth && !halfWidth && modalBodyClassName.push("md:w-[55%] lg:w-[40%] w-[95%] h-fit rounded-lg")

  if (showModal === true && fullWidth === false) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  return (
    <AnimatePresence>
      {showModal &&
        <div>
          {!fullWidth && 
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!disableOutside) {
                  closeModal();
                  setTitle("");
                  setLogin(false);
                  setRegist(false);
                  setForgot(false)
                  dispatch(resetRegister())
                }
              }}
              className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm dark:bg-slate-600/60"
            />
          }

          <motion.div
            initial={{ translateY: -20, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            exit={{ translateY: -20, opacity: 0 }}
            className={["fixed inset-0 z-[999] m-auto overflow-hidden bg-slate-50 p-6 shadow-lg dark:bg-slate-800", modalBodyClassName].join(" ")}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {closeButtonText && 
                  <span
                  className="cursor-pointer"
                    onClick={() => {
                      closeModal();
                      setTitle("");
                      setLogin(false);
                      setForgot(false)
                      setRegist(false);
                      dispatch(resetRegister())
                    }}
                    >
                    <HiArrowLongLeft className={`text-3xl text-primary`} />
                  </span>
                }
                <h3 className="subtitle">
                  {titleModal ? titleModal : title}
                </h3>
              </div>
              {showCloseButton && 
                <span
                className="cursor-pointer"
                  onClick={() => {
                    closeModal();
                    setTitle("");
                    setLogin(false);
                    setForgot(false)
                    setRegist(false);
                    dispatch(resetRegister())
                  }}
                  >
                  <HiXMark className={`text-3xl ${closeButtonText && "hidden"}`} />
                </span>
              }
            </div>

            <div className="">
              {context ? (
                forgot ?
                <ForgotContext
                />  
                : 
                login ? (
                  <LoginContext
                    onLogin={() => {
                      setLogin(false);
                    }}
                    onRegist={() => {
                      setRegist(true);
                      setLogin(false);
                      setTitle("Register");
                    }}
                    onForgot={() => {
                      setForgot(true);
                      setRegist(false);
                      setTitle("Forgot Password");
                    }}
                    onClose ={() => closeModal()}
                  />
                ) : regist ? 
                  <RegisterContext
                  onDoneRegist={()=>{
                    setTitle("Next Step")
                    setRegist(true);
                    setLogin(false);

                  }} 
                  isRegister={isRegister}
                  onLogin={
                    ()=>{
                      setRegist(false)
                      setLogin(true)
                      setTitle("Login");

                    }
                  }
                /> : 
                ""
              ) : (
                children
              )}
            </div>
          </motion.div>
        </div>
      }
    </AnimatePresence>
  );
}
