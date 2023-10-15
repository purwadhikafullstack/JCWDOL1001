import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import Button from "../../components/Button/index.js"
import InputImage from "../../components/InputImage/index.js"
import Modal from "../../components/Modal/index.js";
import { uploadRecipe } from "../../store/slices/upload-recipe/slices.js"
import ShippingAddress from "../../components/Shipping/component.address.js"
import ShippingCost from "../../components/Shipping/component.shipping.js"
import { UploadRecipeValidationSchema } from "../../store/slices/upload-recipe/validation.js"
import { toast } from "react-toastify"
import { getAddress } from "../../store/slices/address/slices.js"

export default function UploadRecipePage(){

    const {isLoading,address,userStatus} = useSelector(state => {
		return {
			isLoading : state?.uploadRecipe?.isLoading,
            address : state?.address?.data,
            userStatus : state?.auth?.status,
		}
	})

    const dispatch = useDispatch()

    const navigate = useNavigate()
    
    const [error, setError] = useState("")

    const [file, setFile] = useState(null)

    const [dataImage, setDataImage] = useState(null)

    const [selectedAddress, setSelectedAddress] = useState([])

    const [selectedCourier, setSelectedCourier] = useState({
        name : "", 
        type :"",
        etd :"",
        cost :""
    })

    const [showModal, setShowModal] = useState({ show: false, context: "" })
    
    const formData = new FormData()

    const handleShowModal = () => {
        setShowModal({ show: true, context:"Konfirmasi" })
        document.body.style.overflow = "hidden"
    }

    const handleCloseModal = () => {
        setShowModal({ show: false, context: "" })
        document.body.style.overflow = "auto"
    }

    const [isToastVisible, setIsToastVisible] = useState(false)

    const onClickYes = async () => {
        try{
            await UploadRecipeValidationSchema.validate(
                {
                    "file":file,
                    "addressId" : selectedAddress.length ===0 ? "" : selectedAddress?.addressId,
                    "courierName" : selectedCourier.name
                }
            ,{
                abortEarly:false
            })

            formData.append("file",file)
            formData.append("address",JSON.stringify(selectedAddress))
            formData.append("courier",JSON.stringify(selectedCourier))
            dispatch(uploadRecipe(formData)).finally(()=>navigate("/","replace"))
            handleCloseModal()

        }catch(error){
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
    useEffect(() => {
        dispatch(getAddress({page:1}))
        setSelectedAddress(address?.find((address)=>{return address?.isPrimary === 1 && address?.isDeleted === 0}))
        if(userStatus===0){
            navigate("/","replace")
            toast.error("Akun belum terverifikasi")
        } 
    },[])

    useEffect(() => {
        setSelectedAddress(address?.find((address)=>{return address?.isPrimary === 1 && address?.isDeleted === 0}))
    },[address])

    return(
        <div className={`container max-w-3xl pt-24  ${window.screen.width <= 500 && "pb-24"}`}>
            <div className="flex flex-col gap-5">
                <h3 className="title">Jasa Pengiriman</h3>
                <ShippingAddress listAddress={address} selectedAddress={selectedAddress} setSelectedAddress={setSelectedAddress} />
                {(error.addressId && selectedAddress.length ===0) && (
                    <div className="text-sm text-red-500 dark:text-red-400 -mt-5">
                        {error.addressId}
                    </div>
                )}
                <ShippingCost selectedAddress={selectedAddress} setShipping={setSelectedCourier} />
                {(error.courierName && selectedCourier.name ==="") && (
                <div className="text-sm text-red-500 dark:text-red-400 -mt-5">
                    {error.courierName}
                </div>
                )}
            </div>
            <div className="flex flex-col gap-5 mt-5">
                <h3 className="title">Upload Resep</h3>
                <span className="title text-md text-slate-500">Foto tidak boleh lebih dari 1Mb.</span>
            </div>
            <InputImage
              file={file}
              setFile={setFile}
              error={error.file}
              setError={setError}
              dataImage={dataImage}
              setDataImage={setDataImage}
            />
            <div className="mt-8 flex gap-2 justify-end">
                <Button
                    isButton
                    isBLock
                    isSecondary
                    title="Back"
                    onClick={()=>navigate("/","replace")}
                />
                <Button 
                    isButton={!isLoading}
                    isBLock
                    isPrimary={!isLoading}
                    isDisabled={isLoading}
                    title="Unggah"
                    onClick={handleShowModal}
                />
            </div>

            <Modal
                showModal={showModal.show}
                closeModal={handleCloseModal}
                title={showModal.context}
            >
                <p className="modal-text">
                    Apa kamu yakin ingin mengunggah gambar ini?
                </p>

                <div className="mt-4 flex justify-end gap-2">
                    
                    <Button 
                        title="Tidak" 
                        isButton 
                        isSecondary 
                        onClick={handleCloseModal} 
                    />
                    <Button
                        title="Ya"
                        isButton
                        isPrimary
                        isDisabled={isToastVisible}
                        onClick={onClickYes}
                    />
                </div>
            </Modal>
        </div>
    )
}