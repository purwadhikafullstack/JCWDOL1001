import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { changeEmail, changeEmailOtp } from "../../../store/slices/auth/slices";
import Input from "../../../components/Input/index.js"
import Button from "../../../components/Button";

export default function Email() {

  const dispatch = useDispatch()
  const emailRef = useRef()
  const otpRef = useRef()
  const [changeEmailPage, setChangeEmailPage]=useState(false);
  const {profile, email} = useSelector(state=>{
    return {
      profile : state.auth.profile,
      email : state.auth.email
    }
  })

  return (
        <div className="col-span-3 h-screen">
          <div className=" border-collapse border-b-2 border-solid border-black">
            <h1 className=" font-extrabold text-3xl text-center">This is the email section</h1>           
          </div>
          <div className="m-4">
            <h1>Your Email : {email} 
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
                        <Input ref={emailRef} required type="email" label="Your New Email" placeholder="example1@example.com"></Input>
                        <Button isPrimary isButton type={"button"} title="Get OTP" className="mt-6 mx-6 p-4"/> 
                    </div>
                    <div className="flex flex-row">
                        <Input ref={otpRef} required type="text" label="Input your OTP" placeholder="......"/>
                    </div>
                    
                    <Button isPrimary isButton type={"submit"} title="Change Email" className="m-6 p-4" onClick={()=>dispatch(changeEmail(
                      {userId : profile.userId, email : emailRef.current.value, otp : otpRef.current.value}))}/>
                </form>
            </div>}
          </div>
        </div>
  )
}
