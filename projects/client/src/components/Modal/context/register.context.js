import Button from "../../Button"
import Input from "../../Input"
import { React, useEffect, useRef, useState} from "react"
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux"
import { login,register, resendOtp } from "../../../store/slices/auth/slices"
import { RegisterValidationSchema } from "../../../store/slices/auth/validation"

export default function RegisterContext ({
    onDoneRegist = ()=>{},
    onLogin = ()=>{},
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
    const [error,setError] = useState("")
    const [isToastVisible,setIsToastVisible] = useState(false)
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

    const onButtonRegist= async(e) => {
        try {
        e.preventDefault()
        setEmail(emailRef.current?.value)
        const request = { 
            name : nameRef.current?.value,
            email : emailRef.current?.value, 
            phone : phoneRef.current?.value, 
            password : passwordRef.current?.value, 
            confirmPassword : confirmPasswordRef.current?.value
        }

        // const sendemail = emailRef.current?.value
        // const name = nameRef.current?.value
        // const phone = phoneRef.current?.value
        // const password = passwordRef.current?.value
        // const confirmPassword = confirmPasswordRef.current?.value
        await RegisterValidationSchema.validate(request, {
            abortEarly: false,
        });
        setError("");
        dispatch(register(request))

      
    } catch (error) {
        const errors = {};

        error.inner.forEach((innerError) => {
          errors[innerError.path] = innerError.message;
        });
        setError(errors);
  
        toast.error("Periksa kembali kolom pengisian!");
  
        setIsToastVisible(true);
  
        setTimeout(() => {
          setIsToastVisible(false);
        }, 2000);
    }
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
                        <span className="mr-2 text-slate-600">Sudah punya akun?</span>
                        <Button
                            title="Masuk"
                            className="text-primary underline"
                            onClick={() => {
                                onLogin()
                            }}
                        />
                      
                
                <form className="flex flex-col gap-8 mt-4" onSubmit={(event)=>{onButtonRegist(event)}} >

                    <div className="flex flex-col gap-3">
                        <div className="flex gap-2">
                        <div>
                        <Input
                            ref={nameRef}
                            required
                            type="text"
                            label="Nama Lengkap"
                            placeholder="Bob Smith"
                            onChange={() => setError({ ...error, name: false })}
                            />
                            {error.name && (
                            <div className="text-sm text-red-500 dark:text-red-400">
                            {error.name}
                            </div>)}
                        </div>
                                
                        <div>
                        <Input
                            ref={phoneRef}
                            required
                            type="text"
                            label="Nomor Telpon"
                            placeholder="08xxxxxxxx"
                            onChange={() => setError({ ...error, phone: false })}
                            />
                        {error.phone && (
                            <div className="text-sm text-red-500 dark:text-red-400">
                            {error.phone}
                            </div>)}
                        </div>
                        </div>

                        <div>
                        <Input
                            ref={emailRef}
                            type="text"
                            label="Email"
                            placeholder="example@email.com"
                            onChange={() => setError({ ...error, email: false })}
                        />
                        {error.email && (
                            <div className="text-sm text-red-500 dark:text-red-400">
                            {error.email}
                            </div>)}
                        </div>
                        
                        <div>
                        <Input
                            ref={passwordRef}
                            required
                            type="password"
                            label="Password"
                            placeholder="Min. 6 karakter"
                            onChange={() => setError({ ...error, password: false })}
                        />
                        {error.password && (
                            <div className="text-sm text-red-500 dark:text-red-400">
                            {error.password}
                            </div>)}
                        </div>

                        <div>
                        <Input
                            ref={confirmPasswordRef}
                            required
                            type="password"
                            label="Konfirmasi Password"
                            placeholder="Min. 6 karakter"
                            onChange={() => setError({ ...error, confirmPassword: false })}
                        />
                        {error.confirmPassword&& (
                            <div className="text-sm text-red-500 dark:text-red-400">
                            {error.confirmPassword}
                            </div>)}
                        </div>
                    </div>
                    <Button
                        isButton
                        isPrimary
                        isDisabled={isToastVisible}
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