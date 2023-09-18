import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import ProfileEmailCard from "./component.profile.email.card";
import { changeEmail, changeEmailOtp } from "../../../store/slices/auth/slices";

export default function ProfileEmail() {

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
    <div className="container py-24">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-y-4 lg:gap-4">
        <ProfileEmailCard profile={profile}/>
        <div className="col-span-3 bg-slate-300 h-screen">
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
                <form className="space-y-4 md:space-y-6 font-medium text-xl mx-6">
                    <div className="flex flex-row">
                        <label for="newEmail" className="block mb-2 text-xl font-medium text-gray-900 dark:text-white w-32">New Email :</label>
                        <input type="email" className="sm:rounded-lg rounded-xl border px-10" id="newEmail" ref={emailRef}/>
                        <button type="button" className=" border-2 border-black mx-8 bg-slate-200 font-bold px-4" onClick={()=>dispatch(changeEmailOtp())}>Get OTP</button>
                    </div>
                    <div className="flex flex-row">
                        <label for="otp" className="block mb-2 text-xl font-medium text-gray-900 dark:text-white w-32">otp :</label>
                        <input type="text" className="sm:rounded-lg rounded-xl border px-10" id="otp" ref={otpRef}/>
                    </div>
                    <button type="button" className="border border-black border-double bg-white hover:bg-slate-200 w-24 items-center" onClick={()=>dispatch(changeEmail(
                      {userId : profile.userId, email : emailRef.current.value, otp : otpRef.current.value}))}>
                        Change Email
                    </button>
                </form>
            </div>}
          </div>
        </div>
      </div>
    </div>
  )
}
