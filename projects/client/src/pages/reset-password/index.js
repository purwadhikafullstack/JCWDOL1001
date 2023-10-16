import { useState, useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import Button from "../../components/Button/index.js"
import { resetPass } from "../../store/slices/auth/slices.js"
import { PasswordValidationSchema } from "../../store/slices/auth/validation.js"
import { toast } from "react-toastify"
import Input from "../../components/Input/index.js"

export default function ResetPassword({
}){
    const location = useLocation()
    const passwordRef = useRef()
    const confirmPasswordRef = useRef()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {resetStatus} = useSelector(state=>{
        return{
            resetStatus : state?.auth?.resetStatus
        }
    })
    const [submit,setSubmit] = useState(false)
    const [isToastVisible, setIsToastVisible] = useState(false)
    const [error, setError] = useState("")
    
    const handleReset = async (e) =>{
        e.preventDefault()
        try{
            const resultPass = passwordRef.current.value
            const resultConfirmPass = confirmPasswordRef.current.value
            const token = location.pathname.split('-password/reset-')[1]
            await PasswordValidationSchema.validate({password : passwordRef.current?.value,
                confirmPassword : confirmPasswordRef.current?.value}, {
                abortEarly: false,
            })
            if(resultPass === resultConfirmPass){
                dispatch(resetPass({password : passwordRef.current?.value, token : token}))
                setError("")
                setSubmit(true)
                
            }

        }catch(error) {
            const errors = {}

            error.inner.forEach((innerError) => {
                errors[innerError.path] = innerError.message;
            })

            setError(errors)
            console.log(errors)
            toast.error("Check your input field!")

            setIsToastVisible(true)

            setTimeout(() => {
                setIsToastVisible(false)
            }, 2000)
        }
    }
    useEffect(()=>{
        if(submit){
            setTimeout(() => {
                navigate("/")
            }, 3000)
        }
    },[resetStatus])
return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
        <span className="text-primary font-semibold text-xl">
            Reset Password
        </span>
        {submit ?         
        <span className="mt-6 text-center">
            Password kamu sudah diubah. 
            <br/>
            Silahkan login menggunakan password yang baru.
        </span>
        :
        <form className="mt-8 flex flex-col gap-4" onSubmit={(event)=>{handleReset(event)}}>
                <div>
                    <Input
                        ref={passwordRef}
                        required
                        type="password"
                        label="Password : "
                        placeholder="..............."
                        errorInput={error.password}
                        onChange={() => setError({ ...error, password: false })}
                        />
                        {error.password && (
                            <div className="text-sm text-red-500 dark:text-red-400">
                                {error.password}
                            </div>
                        )}

                </div>
                <div>
                    <Input
                        ref={confirmPasswordRef}
                        required
                        type="password"
                        label="Konfirmasi Password : "
                        placeholder="··············"
                        errorInput={error.confirmPassword}
                        onChange={() => setError({ ...error, confirmPassword: false })}
                        />
                        {error.confirmPassword && (
                            <div className="text-sm text-red-500 dark:text-red-400">
                                {error.confirmPassword}
                            </div>
                        )}
                </div>

                <Button
                    isButton
                    isPrimary
                    isDisabled={isToastVisible}
                    type={isToastVisible ? "button" : "submit"}
                    title="Ubah Password"
                    className="mt-4 py-3"
                />
        </form>

}
    </div>
)

}