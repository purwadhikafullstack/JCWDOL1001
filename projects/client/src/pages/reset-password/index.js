import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import Button from "../../components/Button/index.js"
import { resetPass } from "../../store/slices/auth/slices.js"

export default function ResetPassword({
}){
    const passwordRef = useRef()
    const confirmPasswordRef = useRef()
    const dispatch = useDispatch()
    const {resetStatus} = useSelector(state=>{
        return {
            resetStatus : state?.auth?.resetStatus
        }
    })
    const handleReset = () =>{
        const resultPass = passwordRef.current.value
        const resultConfirmPass = confirmPasswordRef.current.value
        const token = location.pathname.split('reset-')[1]
        if(resultPass === resultConfirmPass){
            dispatch(resetPass({password : passwordRef.current?.value, token : token}))
        }
        // minus throw Error
    }

    useEffect(()=>{

    })
return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
        <span className="title self-start">
            Reset Password
        </span>
        {resetStatus ?
        
        <form className="mt-8 flex flex-col gap-4" onSubmit={handleReset}>
                <div>
                    <Input
                        ref={passwordRef}
                        required
                        type="password"
                        label="Password"
                        placeholder="..............."
                        errorInput={error}
                        onChange={()=>setError("")}
                    />

                </div>
                <div>
                    <Input
                        ref={confirmPasswordRef}
                        required
                        type="password"
                        label="Confirm Password"
                        placeholder="··············"
                        errorInput={error}
                        onChange={()=>setError("")}
                    />
                </div>

                <Button
                    isButton
                    isPrimary
                    type="submit"
                    title="Ubah Password"
                    className="mt-4 py-3"
                />
        </form>
        :
        <div>
            Your password has been reset. You can login using the newly updated password
        </div>
}
    </div>
)

}