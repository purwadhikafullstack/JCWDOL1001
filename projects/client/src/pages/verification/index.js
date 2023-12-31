
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Button from "../../components/Button"
import Input from "../../components/Input";
import { useDispatch, useSelector } from "react-redux";
import { verify } from "../../store/slices/auth/slices";
import { useLocation, useNavigate } from "react-router-dom";
import { VerifyValidationSchema } from "../../store/slices/auth/validation";
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
    // const addressRef = useRef(null)
    // const districtRef = useRef(null)
    const[isToastVisible,setIsToastVisible] = useState(false)
    const[error,setError] = useState("")
    // const [postalCodeState, setPostalCode] = useState(80351)
    // const [cityRef,setCityRef] = useState("Kabupaten Badung")
    // const [provinceRef,setProvinceRef] = useState("Bali")
    const [refresh,setRefresh] = useState(5)

    // const onProvinceChange = (provinceParams) =>{
    //     const result = provinceParams.split(",")
    //     setProvinceRef(result[1])
    //     dispatch(listCity({province : result[0]}))
    // }

    //logic, kalau pilihan pertama langsung cocok dengan alamat user
    // useEffect(()=>{
    //     setPostalCode(dataCity[0]?.postal_code);

    //     setCityRef(dataCity[0]?.type+" "+dataCity[0]?.city_name)
    // },[dataCity])

    // const onCityChange = (cityParams) =>{
    //     const result = cityParams.split(",")
    //     setPostalCode(result[1]);
    //     setCityRef(result[0])
    // }

    const onButtonSubmit = async () =>{
        try{
        setError("")
        const otp = otpRef.current?.value
        const gender = genderRef.current?.value
        const date = dateRef.current?.value ? dateRef.current?.value : null
        // const address = addressRef.current?.value
        // const district = districtRef.current?.value
        // const city = cityRef
        // const province = provinceRef
        // const postal = postalCodeState
        const token = location.pathname.split('reg-')[1]
        await VerifyValidationSchema.validate({
            otp: otp,
            gender : gender,
            birthdate : date,
        },{
            abortEarly : false
        })
        dispatch(verify({
            token : token,
            otp : otp,
            gender : gender,
            birthdate : date,
            // address : address,
            // district : district,
            // city : city,
            // province : province,
            // postalCode : postal,
        }))
    }
    catch(error){
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

    // useEffect(()=>{
    //     dispatch(listProvince())
    //     dispatch(listCity({province : 1 }))
    // },[])
    
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
                Kamu telah terverifikasi
            </h3>
            
            <span className="text-gray-500 font-semibold">
                Tidak perlu melakukan verifikasi lagi ;D
            </span>
            <span className="text-gray-500 text-sm font-semibold mt-5">
                Kamu akan diarahkan ke beranda dalam {refresh} detik.
            </span>
            <span className="text-gray-500 text-sm font-semibold">
                Jika kamu tidak diarahkan secara otomatis silakan klik <a href="/" className="font-bold text-primary">disini</a>.
            </span>

        </div>

        :

        <div className="container pt-24 w-2/3 h-full">
        <h3 className="text-2xl font-bold">
                Verifikasi
            </h3>
        
        <span className="text-gray-500 font-semibold">
                Isi datamu dan kamu akan segera menjadi bagian dari Apotech!
            </span>
        <div>

    
        <div className="mt-4 py-10 ">  
            <div className="font-semibold text-lg mb-2 text-teal-600">
               Kode OTP :
            </div>
            <div className="mb-5 w-2/5">
                <Input
                ref={otpRef}
                required
                type="text"
                label="OTP : "
                placeholder="6 Karakter"
                onChange={() => setError({ ...error, otp: false })}
                />
                {error.otp && (
                <div className="text-sm text-red-500 dark:text-red-400">
                  {error.otp}
                </div>)}
            </div>
            <div className="font-semibold text-lg mb-2 text-teal-600">
                Informasi Profil : 
            </div>
            <div className="flex flex-row gap-6 mb-5">
                <div>
                Jenis Kelamin :
                <select className="w-full rounded-lg border h-max bg-inherit px-2 py-2 outline-none focus:ring-2
            focus:ring-primary/50 dark:focus:ring-primary border-slate-300 focus:border-primary" 
                ref={genderRef}
                onChange={() => setError({ ...error, gender: false })}
                >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                </select>
                {error.gender && (
                <div className="text-sm text-red-500 dark:text-red-400">
                  {error.gender}
                </div>
              )}
                </div>
                <div>
                <Input
                ref={dateRef}
                required
                type="date"
                label="Tanggal Lahir : "
                placeholder="10-10-2000"
                onChange={() => setError({ ...error, birthdate: false })}
                />
                {error.birthdate && (
                    <div className="text-sm text-red-500 dark:text-red-400">
                    {error.birthdate === "Pengguna minimal berumur 12 tahun"? 
                    error.birthdate : "Tanggal lahir dibutuhkan"
                    }
                    </div>
                )}
                </div>
             
             </div>
             {/* <div className="font-semibold text-lg mb-2 text-teal-600">
                Informasi Alamat :
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


                </div> */}
                <div className="w-full flex flex-col items-center">
                    <Button
                        isButton
                        isPrimary
                        type="submit"
                        title="Submit"
                        className="mt-4 py-3 text-2xl font-semibold w-1/2"
                        isDisabled={isToastVisible}
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
