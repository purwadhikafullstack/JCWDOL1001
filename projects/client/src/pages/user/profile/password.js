import { useDispatch, useSelector } from "react-redux";
import ProfilePasswordCard from "./component.profile.password.card";
import {useEffect, useRef } from "react";
import { changePassword } from "../../../store/slices/auth/slices";

export default function ProfilePassword() {

  const dispatch = useDispatch()
  const oldPasswordRef = useRef();
  const newPasswordRef = useRef();
  const rePasswordRef = useRef();

  const {profile} = useSelector(state=>{
    return {
      profile : state.auth.profile
    }
  })

  return (
    <div className="container py-24">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-y-4 lg:gap-4">
        <ProfilePasswordCard profile={profile}/>
        <div className="col-span-3 bg-slate-400 h-screen border-double rounded-xl">
          <div className=" border-collapse border-b-2 border-solid border-black">
            <h1 className=" font-extrabold text-3xl text-center">This is the Password section</h1>           
          </div>
          <div>
            <form className="flex flex-col p-4">
              <div className="flex flex-row space-x-4 mb-5 font-medium text-xl align-middle justify-start">
                <label for="oldPassword" className="block mb-2 text-xl font-medium text-gray-900 dark:text-white w-40">Old Password :</label>
                <input type="password" className="sm:rounded-lg rounded-xl border" id="oldPassword" required ref={oldPasswordRef}/>
              </div>
              <div className="flex flex-row space-x-4 mb-5 font-medium text-xl">
                <label for="newPassword" className="block mb-2 text-xl font-medium text-gray-900 dark:text-white w-40">New Password :</label>
                <input type="password" className="sm:rounded-lg rounded-xl border" id="newPassword" required ref={newPasswordRef}/>
              </div>
              <div className="flex flex-row space-x-4 mb-5 font-medium text-xl">
                <label for="rePassword" className="block mb-2 text-xl font-medium text-gray-900 dark:text-white w-40">Re Password :</label>
                <input type="password" className="sm:rounded-lg rounded-xl border" id="rePassword" required ref={rePasswordRef}/>
              </div>
              <button type="button" className="border border-black border-double bg-white hover:bg-slate-200 w-24 items-center" onClick={()=>dispatch(changePassword({userId : profile.userId, 
                oldPassword : oldPasswordRef.current.value,
                newPassword : newPasswordRef.current.value,
                rePassword : rePasswordRef.current.value
                }))}>Change Password</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
