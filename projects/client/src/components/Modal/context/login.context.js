import { React, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Button from "../../Button"
import Input from "../../Input"
import { login } from "../../../store/slices/auth/slices"
import { LoginValidationSchema } from "../../../store/slices/auth/validation"
import { toast } from "react-toastify"

export default function LoginContext ({
    onLogin = ()=>{},
    onRegist = ()=>{},
    onForgot = ()=>{},
    onClose = ()=>{},
})
{
    const dispatch = useDispatch()
    const {isLogin} = useSelector(state => {
		return {
			isLogin : state?.auth?.isLogin
		}
	})
    
    const emailRef = useRef(null)
    const passwordRef = useRef(null)
    const [isToastVisible, setIsToastVisible] = useState(false)
    const [error, setError] = useState("")

    const handleLogin = async (e) => {
        e.preventDefault()
        const output = {email :emailRef.current?.value ,password:passwordRef.current?.value}
        try{
            await LoginValidationSchema.validate(output, {
                abortEarly: false,
            })
            setError("")
            dispatch(login(output))

        }catch(error) {
            const errors = {}

            error.inner.forEach((innerError) => {
                errors[innerError.path] = innerError.message;
            })

            setError(errors)

            toast.error("Check your input field!")

            setIsToastVisible(true)

            setTimeout(() => {
                setIsToastVisible(false)
            }, 2000)
        }
    }

    if(isLogin){
        onClose()
    }

    return (
        <div>
            <span className="mr-2 text-slate-600">Belum punya akun?</span>
            <Button
                title="Daftar"
                className="text-primary underline"
                onClick={() => {
                    onLogin()
                    onRegist()
                }}
            />  
            <form className="mt-8 flex flex-col gap-4" onSubmit={(e)=>handleLogin(e)}>
                <div>
                    <Input
                        ref={emailRef}
                        type="text"
                        label="Email"
                        placeholder="example@email.com"
                        errorInput={error.email }
                        onChange={() => setError({ ...error, email: false })}
                    />
                    {error.email && (
                        <div className="text-sm text-red-500 dark:text-red-400">
                            {error.email}
                        </div>
                    )}
                </div>
                <div>
                    <Input
                        ref={passwordRef}
                        required
                        type="password"
                        label="Password"
                        placeholder="··············"
                        errorInput={error.password}
                        onChange={() => setError({ ...error, password: false })}
                    />
                    {error.password && (
                        <div className="text-sm text-red-500 dark:text-red-400">
                            {error.password}
                        </div>
                    )}
                    <Button
                        isLink
                        title="Lupa password?"
                        className="w-fit text-sm text-primary hover:underline"
                        onClick={() => {
                            onLogin()
                            onRegist()
                            onForgot()
                        }}
                    />
                </div>

                <Button
                    isButton
                    isPrimary
                    isDisabled={isToastVisible}
                    type={isToastVisible ? "button" : "submit"}
                    title="Masuk"
                    className="mt-4 py-3"
                />
            </form>
        </div>
    )
} 