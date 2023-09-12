import { React, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import Button from "../../Button"
import Input from "../../Input"
import { login } from "../../../store/slices/auth/slices"

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

    const emailRef = useRef()
    const passwordRef = useRef()

    const handleLogin = (e) => {
        e.preventDefault()
        const email = emailRef.current?.value
        const password = passwordRef.current?.value
        dispatch(login({ email, password }))
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
                <Input
                    ref={emailRef}
                    type="text"
                    label="Email"
                    placeholder="example@email.com"
                />

                <div>
                    <Input
                        ref={passwordRef}
                        required
                        type="password"
                        label="Password"
                        placeholder="··············"
                    />

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
                    type="submit"
                    title="Masuk"
                    className="mt-4 py-3"
                />
            </form>
        </div>
    )
} 