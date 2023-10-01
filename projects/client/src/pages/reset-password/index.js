export default function ResetPassword({

}){
    
return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
        <span className="title">
            Reset Password
        </span>
      <form className="mt-8 flex flex-col gap-4" onSubmit={(e)=>handleLogin(e)}>
                <div>
                    <Input
                        ref={emailRef}
                        type="password"
                        label="Password"
                        placeholder="example@email.com"
                    />

                </div>
                <div>
                    <Input
                        ref={passwordRef}
                        required
                        type="password"
                        label="Confirm Password"
                        placeholder="··············"
                        // errorInput={error}
                        // onChange={()=>setError("")}
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
    </div>
)

}