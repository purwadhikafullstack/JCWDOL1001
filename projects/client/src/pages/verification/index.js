
import { useEffect, useRef, useState } from "react";

import Button from "../../components/Button"
import Input from "../../components/Input";
import { useDispatch, useSelector } from "react-redux";
import { verify } from "../../store/slices/auth/slices";
import { useLocation, useNavigate } from "react-router-dom";
import { listCity, listProvince } from "../../store/slices/address/slices";
import GetProvince from "./components/component.province";
import GetCity from "./components/component.city";
export default function Verification() {
    //pake uuid dari response register buat bikin trigger ke /landingpage
    const location = useLocation()
    const { user, dataProvince, dataCity } = useSelector(state => {
		return { 
			user : state?.auth,
            dataProvince : state?.address?.province,
            dataCity : state?.address?.city
		}
	})
    
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const otpRef = useRef(null)
    const genderRef = useRef(null)
    const dateRef = useRef(null)
    const addressRef = useRef(null)
    const districtRef = useRef(null)
    
    const [postalCodeState, setPostalCode] = useState(80351)
    const [cityRef,setCityRef] = useState("Kabupaten Badung")
    const [provinceRef,setProvinceRef] = useState("Bali")
    const [refresh,setRefresh] = useState(5)

    const onProvinceChange = (provinceParams) =>{
        const result = provinceParams.split(",")
        setProvinceRef(result[1])
        dispatch(listCity({province : result[0]}))
    }

    //logic, kalau pilihan pertama langsung cocok dengan alamat user
    useEffect(()=>{
        setPostalCode(dataCity[0]?.postal_code);

        setCityRef(dataCity[0]?.type+" "+dataCity[0]?.city_name)
    },[dataCity])

    const onCityChange = (cityParams) =>{
        const result = cityParams.split(",")
        setPostalCode(result[1]);
        setCityRef(result[0])
    }



    const onButtonSubmit = () =>{
        const otp = otpRef.current?.value
        const gender = genderRef.current?.value
        const date = dateRef.current?.value
        const address = addressRef.current?.value
        const district = districtRef.current?.value
        const city = cityRef
        const province = provinceRef
        const postal = postalCodeState
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
            postalCode : postal,
        }))
    }

    useEffect(()=>{
        dispatch(listProvince())
        dispatch(listCity({province : 1 }))
    },[])
    
    useEffect(()=>{
        //ada tombol setelah 5 detik, terus countdown ikutin dari verify aja
        if(user?.status === 1){
            const timeoutID = setTimeout(()=>{
            navigate("/")
        }, 5000)

        return () => clearTimeout(timeoutID)
    }
    },[user])

    useEffect(()=>{
        const timeoutRefresh = setTimeout(() => {
            if(refresh > 0){
                setRefresh(refresh - 1)
            }
        }, 1000)
        return () => clearTimeout(timeoutRefresh)
    },[user])

  return (
      <div className="w-full flex flex-col items-center">
    {
        user?.status === 1 ? 
        <div className="container pt-24 w-2/3 h-full flex flex-col">
            <h3 className="text-2xl font-bold">
                    You have been verified.
            </h3>
            
            <span className="text-gray-500 font-semibold">
                    No need to verify more than once ;D
            </span>
            <span className="text-gray-500 text-sm font-semibold mt-5">
                    You will redirected to homepage in {refresh} s.
            </span>
            <span className="text-gray-500 text-sm font-semibold">
                    or click <a href="/" className="font-bold text-primary">here</a>.
            </span>

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
                <div>
                Gender :
                <select className="w-full rounded-lg border h-max bg-inherit px-2 py-2 outline-none focus:ring-2
            focus:ring-primary/50 dark:focus:ring-primary border-slate-300 focus:border-primary" 
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
                <GetProvince
                onProvinceChange={onProvinceChange}
                province={dataProvince}
                />

                <GetCity
                onCityChange={onCityChange}
                city={dataCity}
                />
                <Input
                ref={districtRef}
                required
                type="text"
                label="District :"
                placeholder="e.g. Tebet"
                />

                <Input
                ref={addressRef}
                required
                type="text"
                label="Address : "
                placeholder="e.g. Jalan Pelangi"
                />

                <div classname="flex flex-col">
                    <span>
                        Postal Code :
                    </span>
                    <div
                    className="w-full rounded-lg border bg-inherit px-2 py-2 outline-none focus:ring-2
                    focus:ring-primary/50 dark:focus:ring-primary border-slate-300 focus:border-primary
                    ">
                    {postalCodeState}    
                    </div>
                </div>


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

      </div> 
            }
    </div>
  );
}
