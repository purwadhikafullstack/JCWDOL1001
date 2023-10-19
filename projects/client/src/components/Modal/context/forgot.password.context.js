import Button from "../../Button"
import Input from "../../Input"
import { React, useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { forgotPass } from "../../../store/slices/auth/slices"
import { ForgotPassValidationSchema, LoginValidationSchema } from "../../../store/slices/auth/validation"
import { toast } from "react-toastify"

export default function ForgotContext ({
    onLogin = ()=>{},
    onRegist = ()=>{}
}){
    const dispatch = useDispatch()
    const {isForgot} = useSelector(state => {
		return {
            isForgot : state?.auth?.isForgot
		}
	})
    
    const emailRef = useRef(null)
    const [email,setEmail] = useState("")
    const [submit,setSubmit] = useState(false)
    const [isToastVisible, setIsToastVisible] = useState(false)
    const [error, setError] = useState("")

    const handleForgot= async (e) => {
        e.preventDefault()
        try{
   
            await ForgotPassValidationSchema.validate({email :emailRef.current?.value}, {
                abortEarly: false,
            })
            setError("")
            dispatch(forgotPass({email :emailRef.current?.value}))
            setSubmit(true)
            setEmail(emailRef.current?.value)
        }catch(error) {
            const errors = {}

            error.inner.forEach((innerError) => {
                errors[innerError.path] = innerError.message;
            })

            setError(errors)

            toast.error("Periksa kembali kolom pengisian!")

            setIsToastVisible(true)

            setTimeout(() => {
                setIsToastVisible(false)
            }, 2000)
        }
    }

    return (
        <div>
        {submit ? 
            <div className="flex flex-col gap-10">
                <span>
                Kami telah mengirimkan form reset melalui email ke {email}.
                </span>
            </div> :
            <div>
            <form className="mt-8 flex flex-col gap-5" onSubmit={(event)=>{handleForgot(event)}} >
                <span className="text-gray-600">
                    Masukkan email untuk dikirimkan form reset.
                </span>
                <div className="flex flex-col gap-6">
                    <Input
                        ref={emailRef}
                        type="text"
                        label="Email"
                        errorInput={error.email}
                        onChange={() => setError({ ...error, email: false })}
                    />
                    {error.email && (
                        <div className="text-sm text-red-500 dark:text-red-400">
                            {error.email}
                        </div>
                    )}
                </div>
                <Button
                    isButton
                    isPrimary
                    isDisabled={isToastVisible}
                    type={isToastVisible ? "button" : "submit"}
                    title="Kirim Form Reset"
                    className="mt-4 py-3"
                />
            </form>
            </div>
    }
    </div>
    )
}