import Button from "../../Button"
import Input from "../../Input"
import { React, useEffect, useRef, useState} from "react"

import { useDispatch, useSelector } from "react-redux"

import { login,register, resendOtp } from "../../../store/slices/auth/slices"

export default function RegisterContext ({
    onDoneRegist = ()=>{},
}){

    const {isRegister} = useSelector(state =>{
        return {
            isRegister : state?.auth?.isRegister
        }
    })

    const [submit , setSubmit] = useState(false);
    const [resend,setResend] = useState(true);
    const dispatch = useDispatch()
    const [email,setEmail] = useState(false);
    const [refresh, setRefresh] = useState(30);
    const nameRef = useRef()
    const emailRef = useRef()
    const phoneRef = useRef()
    const passwordRef = useRef()
    const confirmPasswordRef = useRef()
    //resend otp logic
    useEffect(()=>{
        const timeoutID = setTimeout(() => {
            if (submit && resend && refresh > 0){
                setRefresh(refresh - 1)
            }
        }, 1000)

        if ( submit && resend && refresh === 0){
            setResend(false)
        }
        return () => clearTimeout(timeoutID)
    },[refresh,submit])

    const onButtonResend = () => {
        setRefresh(30)
        dispatch(resendOtp({email : email}))
        setResend(true)
    }

    const onButtonRegist= (e) => {
        e.preventDefault()
        setEmail(emailRef.current?.value)
        const sendemail = emailRef.current?.value
        const name = nameRef.current?.value
        const phone = phoneRef.current?.value
        const password = passwordRef.current?.value
        const confirmPassword = confirmPasswordRef.current?.value
       dispatch(register({ name : name, email : sendemail, phone : phone, password : password, confirmPassword : confirmPassword}))
    }

    useEffect(()=>{
        if(isRegister && email){
            onDoneRegist()
            setSubmit(true)
        }
        if(!email){
            setSubmit(false)
        }
    },[email,isRegister])


    return (
        <div>
            {submit ? 
                <div className="flex flex-col gap-10">
                    <span>
                        We have sent OTP and verification link via email to {email}
                    </span>
                    <div className="flex flex-col items-start justify-start">
                        <span className="text-gray-500 font-semibold text-sm">
                        You need to wait for {refresh} s to resend the data.
                        </span>
                        
                        <Button
                           
                            onClick={()=>{onButtonResend()}}
                            className="block rounded-lg bg-teal-500 py-3 min-w-[52px] disabled:opacity-40 text-white duration-200 hover:bg-slate-200 lg: lg:group-hover:w-full"
                            isLoading={resend}>
                            <div className="flex w-max items-center gap-6 px-3 ">
                                <span>Resend OTP</span>
                            </div>
                        </Button>
                        
                    </div>
                </div> :
                <div>
                <form className="mt-8 flex flex-col gap-8" onSubmit={(event)=>{onButtonRegist(event)}} >

                    <div className="flex flex-col gap-3">
                {/* <span className="mr-2 text-slate-600 text-sm">Mari bergabung dengan keluarga Apotech</span> */}
                        <Input
                            ref={nameRef}
                            required
                            type="text"
                            label="Username"
                            placeholder="e.g. helloworld"
                
                        />

                        <Input
                            ref={phoneRef}
                            required
                            type="text"
                            label="Phone Number"
                            placeholder="e.g. 08123456123"
                        />
                        <Input
                            ref={emailRef}
                            type="text"
                            label="Email"
                            placeholder="e.g. example@email.com"
                        />

                        <Input
                            ref={passwordRef}
                            required
                            type="password"
                            label="Password"
                            placeholder="min. 6 characters"
                        />
                        <Input
                            ref={confirmPasswordRef}
                            required
                            type="password"
                            label="Confirm Password"
                            placeholder="min. 6 characters"
                        />
                    </div>
                    <Button
                        isButton
                        isPrimary
                        type="submit"
                        title="Daftar"
                        className="mt-4 py-3"
                    />
                </form>
                </div>
        }
        </div>
    )
}