import { useRef, useState } from "react";
import Button from "../../components/Button"
import Input from "../../components/Input";
import { useDispatch, useSelector } from "react-redux";
import { verify } from "../../store/slices/auth/slices";
import { useLocation, useNavigate } from "react-router-dom";
export default function Verification() {
    //pake uuid dari response register buat bikin trigger ke /landingpage
    const location = useLocation()
    const { user } = useSelector(state => {
		return { 
			user : state?.auth
		}
	})

    
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const otpRef = useRef(null)
    const genderRef = useRef(null)
    const dateRef = useRef(null)
    const addressRef = useRef(null)
    const districtRef = useRef(null)
    const cityRef = useRef(null)
    const provinceRef = useRef(null)
    const postalRef = useRef(null)
    const onButtonSubmit = () =>{
        const otp = otpRef.current?.value
        const gender = genderRef.current?.value
        const date = dateRef.current?.value
        const address = addressRef.current?.value
        const district = districtRef.current?.value
        const city = cityRef.current?.value
        const province = provinceRef.current?.value
        const postal = postalRef.current?.value
        const token = location.pathname.split('reg-')[1]

        dispatch(verify({
            token : token,
            otp : otp,
            gender : gender,
            birthdate : date,
            address : address,
            district : district,
            city : city,
            province : province,
            postalCode : postal
        }))
        
    }

  return (
      <div className="w-full flex flex-col items-center">
    {
        user?.status === 1 ? 
        <div className="container pt-24 w-2/3 h-full">
        <h3 className="text-2xl font-bold">
                You have been verified.
            </h3>
        
        <span className="text-gray-500 font-semibold">
                No need to verify more than once ;D
            </span>
        <div>
            </div>
        </div>

        :
      <div className="container pt-24 w-2/3 h-full">
        <h3 className="text-2xl font-bold">
                Verification
            </h3>
        
        <span className="text-gray-500 font-semibold">
                Fill the form, and you ready to go!
            </span>
        <div>

    
        <div className="mt-4 py-10 ">  
            <div className="font-semibold text-lg mb-2 text-teal-600">
               OTP Code :
            </div>
            <div className="mb-5 w-2/5">
                <Input
                ref={otpRef}
                required
                type="text"
                label="OTP : "
                placeholder="6 Characters"
                />
            </div>
            <div className="font-semibold text-lg mb-2 text-teal-600">
                Profile Information : 
            </div>
            <div className="flex flex-row gap-6 mb-5">
                {/* <Input
                ref={genderRef}
                required
                type="text"
                label="Gender : "
                placeholder="Male or Female?"
                /> */}
                <div>
                Gender :
                <select className="w-full rounded-lg border bg-inherit px-2 py-2 outline-none focus:ring-2 " 
                ref={genderRef}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
                </div>
                <Input
                ref={dateRef}
                required
                type="date"
                label="Birthdate : "
                placeholder="10-10-2000"
                />
             </div>

             <div className="font-semibold text-lg mb-2 text-teal-600">
                Address Information :
             </div>
             <div className="flex flex-col gap-3 mb-5">
                <Input
                ref={addressRef}
                required
                type="text"
                label="Address : "
                placeholder="e.g. Jalan Pelangi"
                />
                <Input
                ref={districtRef}
                required
                type="text"
                label="District :"
                placeholder="e.g. Tebet"
                />
                <Input
                ref={cityRef}
                required
                type="text"
                label="City :"
                placeholder="e.g. Jakarta"
                />
                <Input
                ref={provinceRef}
                required
                type="text"
                label="Province :"
                placeholder="e.g. DKI Jakarta"
                />
                <Input
                ref={postalRef}
                required
                type="number"
                label="Postal Code :"
                placeholder="e.g. 40141"
                />
                </div>
                <div className="w-full flex flex-col items-center">
                    <Button
                        isButton
                        isPrimary
                        type="submit"
                        title="Submit"
                        className="mt-4 py-3 text-2xl font-semibold w-1/2"
                        onClick={onButtonSubmit}
                        />
                    </div>
                </div>
             </div>


        <div className="grid w-full grid-cols-1 justify-between gap-4 py-10 ">

        </div>
      </div> 
            }
    </div>
  );
}
