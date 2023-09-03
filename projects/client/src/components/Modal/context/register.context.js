import Button from "../../Button"
import Input from "../../Input"
import { React, useEffect, useRef, useState} from "react"
import { useDispatch } from "react-redux"
import { login,register } from "../../../store/slices/auth/slices"

export default function RegisterContext ({
    onDoneRegist = ()=>{},
}){
    const [submit , setSubmit] = useState(false);
    const dispatch = useDispatch()
    const [email,setEmail] = useState(false);
    const [refresh, setRefresh] = useState(30);
    const nameRef = useRef()
    const emailRef = useRef()
    const phoneRef = useRef()
    const passwordRef = useRef()
    const confirmPasswordRef = useRef()
    // function countdown(from, to) {
    //     let current = refresh;
    
    //     setTimeout(function go() {
    //       alert(current);
    //       if (current < to) {
    //         setTimeout(go, 1000);
    //       }
    //       current--;
    //     }, 1000);
    //   }
      
    //   // usage:
    //   countdown(30, 0);

    // useEffect(()=>{

    // },[])
    const onButtonResend = () => {
        
    }

    const onButtonRegist= () => {
        onDoneRegist()
        setEmail(emailRef.current?.value)
        const sendemail = emailRef.current?.value
        const name = nameRef.current?.value
        const phone = phoneRef.current?.value
        const password = passwordRef.current?.value
        const confirmPassword = confirmPasswordRef.current?.value
       dispatch(register({ name : name, email : sendemail, phone : phone, password : password, confirmPassword : confirmPassword}))
       console.log(phone) 
       setSubmit(true)
    }
    return (
        <div>
            {submit ? 
                <div className="flex flex-col gap-10">
                    <span>
                        We have sent OTP and verification link via email to {email}
                        <span className="text-gray-500 font-semibold">

                        </span>
                    </span>
                </div> :
                
                <form className="mt-8 flex flex-col gap-8" >
                    <div className="flex flex-col gap-3">
                        <Input
                            ref={nameRef}
                            required
                            type="text"
                            label="Username"
                            placeholder="e.g. helloworld"
                        />
                        <Input
                            ref={emailRef}
                            type="text"
                            label="Email"
                            placeholder="e.g. example@email.com"
                        />
                        <Input
                            ref={phoneRef}
                            required
                            type="text"
                            label="Phone Number"
                            placeholder="e.g. 08123456123"
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
                        onClick={onButtonRegist}
                    />
                </form>
        }
        </div>
    )
}