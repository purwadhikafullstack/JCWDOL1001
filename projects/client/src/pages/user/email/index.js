import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { changeEmail, changeEmailOtp, forcedLogout} from "../../../store/slices/auth/slices";
import Input from "../../../components/Input/index.js"
import Button from "../../../components/Button";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { changeEmailValidationSchema } from "../../../store/slices/auth/validation";

export default function Email() {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const emailRef = useRef()
  const otpRef = useRef()
  const [changeEmailPage, setChangeEmailPage]=useState(false);
  const {profile, email} = useSelector(state=>{
    return {
      profile : state.auth.profile,
      email : state.auth.email,
    }
  })
  const [error, setError] = useState("");
  const [isToastVisible, setIsToastVisible] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault()
    try{
      await changeEmailValidationSchema.validate({
        email : emailRef.current.value
      },{abortEarly : false})
      dispatch(changeEmail(
        {userId : profile.userId, email : emailRef.current.value, otp : otpRef.current.value})).then(()=>{navigate("/");dispatch(forcedLogout())})
      setError("")
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

  

  return (
        <div className="h-screen">
          <div className="">
            <h3 className="title">Email</h3>           
          </div>
          <div className="mt-4 flex flex-row">
            <h1>Email Anda : {email} 
            {changeEmailPage && 
            <Button isSmall isDanger className="ml-4" onClick={()=>setChangeEmailPage(false)}>Batal</Button> 
            }
            {
            !changeEmailPage && <Button isSmall isPrimary className="ml-4" onClick={()=>setChangeEmailPage(true)}>Ubah</Button>
            }
            </h1>
          </div>
          <div>
            {changeEmailPage && 
            <div>
                <form className="space-y-4 font-medium mt-4 w-full md:w-1/2" onSubmit={(event)=>handleReset(event)}>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <Input ref={emailRef} required type="email" label="Email Baru Anda" placeholder="example1@example.com"></Input>
                      </div>
                        <Button isPrimary isButton type={"button"} className="self-end" title="Kirim OTP" onClick={()=>dispatch(changeEmailOtp({userId : profile.userId}))}/> 
                    </div>
                    <div className="w-full">
                        <Input ref={otpRef} required type="text" label="Masukkan OTP Anda" placeholder="......"/>
                    </div>
                    
                    <Button isPrimary isButton isDisabled={isToastVisible} type={isToastVisible ? "button" : "submit"} title="Ubah Email" className="mt-4"/>
                </form>
            </div>}
          </div>
        </div>
  )
}
