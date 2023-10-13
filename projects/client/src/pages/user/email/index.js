import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { changeEmail, changeEmailOtp, keepLogin } from "../../../store/slices/auth/slices";
import Input from "../../../components/Input/index.js"
import Button from "../../../components/Button";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

export default function Email() {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const emailRef = useRef()
  const otpRef = useRef()
  const [changeEmailPage, setChangeEmailPage]=useState(false);
  const {profile, email, emailChangeStatus} = useSelector(state=>{
    return {
      profile : state.auth.profile,
      email : state.auth.email,
      emailChangeStatus : state.auth.emailChangeStatus
    }
  })
  const [status, setStatus] = useState(emailChangeStatus)

  if(status === "success"){
    toast.success("Email telah berhasil dirubah!")
    setStatus(null)
  }

  return (
        <div className="col-span-3 h-screen">
          <div className=" border-collapse border-b-2 border-solid border-black">
            <h1 className=" font-extrabold text-3xl text-center">Bagian Email :</h1>           
          </div>
          <div className="m-4">
            <h1>Email Anda : {email} 
            {changeEmailPage && 
            <button className=" text-green-700 mx-6" onClick={()=>setChangeEmailPage(false)}>Batal</button> 
            }{
                !changeEmailPage && <button className=" text-green-700 mx-6" onClick={()=>setChangeEmailPage(true)}>Ubah</button>
            }
            </h1>
          </div>
          <div>
            {changeEmailPage && 
            <div>
                <form className="space-y-4 md:space-y-6 font-medium text-xl m-6">
                    <div className="flex flex-row">
                        <Input ref={emailRef} required type="email" label="Email Baru Anda" placeholder="example1@example.com"></Input>
                        <Button isPrimary isButton type={"button"} title="Ambil OTP" className="mt-6 mx-6 p-4" onClick={()=>dispatch(changeEmailOtp({userId : profile.userId}))}/> 
                    </div>
                    <div className="flex flex-row">
                        <Input ref={otpRef} required type="text" label="Masukkan OTP Anda" placeholder="......"/>
                    </div>
                    
                    <Button isPrimary isButton type={"submit"} title="Ubah Email" className="m-6 p-4" onClick={()=>{dispatch(changeEmail(
                      {userId : profile.userId, email : emailRef.current.value, otp : otpRef.current.value}))
                      }}/>
                </form>
            </div>}
          </div>
        </div>
  )
}
