import { useDispatch, useSelector } from "react-redux";
import {useState, useRef } from "react";
import { changePassword} from "../../../store/slices/auth/slices";
import Input from "../../../components/Input";
import { changePasswordValidationSchema } from "../../../store/slices/auth/validation";
import Button from "../../../components/Button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"

export default function Password() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const oldPasswordRef = useRef();
  const newPasswordRef = useRef();
  const rePasswordRef = useRef();
  const [error, setError] = useState("");
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [submit,setSubmit] = useState(false);

  const {profile, passwordChangeStatus} = useSelector(state=>{
    return {
      profile : state.auth.profile,
      passwordChangeStatus : state.auth.passwordChangeStatus
    }
  })

  const handleReset = async (e) => {
    e.preventDefault()
    try{
      await changePasswordValidationSchema.validate({
        oldPassword : oldPasswordRef.current.value,
        newPassword : newPasswordRef.current.value,
        rePassword : rePasswordRef.current.value
      },{abortEarly : false})
      if(newPasswordRef.current.value === rePasswordRef.current.value){
        dispatch(changePassword({userId : profile.userId, 
          oldPassword : oldPasswordRef.current.value,
          newPassword : newPasswordRef.current.value,
          rePassword : rePasswordRef.current.value
          }))
          setError("")
          setSubmit(true)
      }
    }catch(error){
      const errors = {}
      
      error.inner.forEach((innerError) => {
        errors[innerError.path] = innerError.message;
      })

      setError(errors)
      if(error.message.includes("errors")){
        toast.error("Periksa kolom pengisian!")
      }else{
        toast.error(error.message)
      }

      setIsToastVisible(true)

      setTimeout(() => {
        setIsToastVisible(false)
      }, 2000)
    }
  }
  
  if(passwordChangeStatus === "success"){
    oldPasswordRef.current.value = null;
    newPasswordRef.current.value = null;
    rePasswordRef.current.value = null;
  }

  return (
        <div className="col-span-3 h-screen border-double rounded-xl">
          <div className="">
            <h3 className="title">Password</h3>           
          </div>
          <div>
            <form className="flex flex-col p-4" onSubmit={(event) => handleReset(event)}>
                <div>
                  <Input
                    ref={oldPasswordRef}
                    required
                    type="password"
                    label="Password Lama Anda"
                    placeholder="******"
                    errorInput={error.oldPassword}
                  />
                  {error.oldPassword && (
                            <div className="text-sm text-red-500 dark:text-red-400">
                                {error.oldPassword}
                            </div>
                  )}
                </div>
                <div>
                  <Input
                    ref={newPasswordRef}
                    required
                    type="password"
                    label="Password Baru Anda"
                    placeholder="******"
                    errorInput={error.newPassword}
                  />
                  {error.newPassword && (
                            <div className="text-sm text-red-500 dark:text-red-400">
                                {error.newPassword}
                            </div>
                  )}
                </div>
                <div>
                  <Input
                    ref={rePasswordRef}
                    required
                    type="password"
                    label="Konfirmasi Password Baru"
                    placeholder="******"
                    errorInput={error.rePassword}
                  />
                  {error.rePassword && (
                            <div className="text-sm text-red-500 dark:text-red-400">
                                {error.rePassword}
                            </div>
                  )}
                </div>
                <Button isButton isPrimary isDisabled={isToastVisible} type={isToastVisible ? "button" : "submit"} title="Change Password" className="mt-4 py-3"/>
            </form>
          </div>
        </div>
  )
}
