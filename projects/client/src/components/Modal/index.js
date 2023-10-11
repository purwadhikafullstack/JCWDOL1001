import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { HiXMark } from "react-icons/hi2";
import LoginContext from "./context/login.context";
import RegisterContext from "./context/register.context";
import ForgotContext from "./context/forgot.password.context";
import Button from "../Button";

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

  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === "Escape") {
        closeModal();
        setTitle("");
      }
    };

    context === "login" ? setLogin(true) :  setRegist(true); 

    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };

    
  }, [closeModal, showModal]);

  const modalBodyClassName = []

  fullWidth === true && modalBodyClassName.push("w-full h-full")

  halfWidth === true && modalBodyClassName.push("lg:w-3/4 md:w-3/4 w-5/6 h-fit rounded-lg")

  !fullWidth && !halfWidth && modalBodyClassName.push("md:w-[55%] lg:w-[40%] w-5/6 h-fit rounded-lg")

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
              <h3 className="subtitle">
                {titleModal ? titleModal : title}
              </h3>
              {showCloseButton && 
                <span
                className="cursor-pointer"
                  onClick={() => {
                    closeModal();
                    setTitle("");
                    setLogin(false);
                    setForgot(false)
                    setRegist(false);
                  }}
                  >
                    {closeButtonText ? 
                      <Button isButton isPrimaryOutline >Kembali</Button> 
                    :
                      <HiXMark className="text-3xl" />
                    }
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
                  setTitle("Next Step")}} 
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
