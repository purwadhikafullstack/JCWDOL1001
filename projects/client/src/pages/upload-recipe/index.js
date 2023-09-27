import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import Button from "../../components/Button/index.js"
import InputImage from "../../components/InputImage/index.js"
import Modal from "../../components/Modal/index.js";
import { uploadRecipe } from "../../store/slices/upload-recipe/slices.js"
import ShippingAddress from "../../components/Shipping/component.address.js"
import { getAddress } from "../../store/slices/address/slices.js"
import ShippingCost from "../../components/Shipping/component.shipping.js"

export default function UploadRecipePage(){

    const {isLoading,address} = useSelector(state => {
		return {
			isLoading : state?.uploadRecipe?.isLoading,
            address : state?.address?.data,
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
        setShowModal({ show: true, context:"Confirmation" })
        document.body.style.overflow = "hidden"
    }

    const handleCloseModal = () => {
        setShowModal({ show: false, context: "" })
        document.body.style.overflow = "auto"
    }

    const onClickYes = () => {
        formData.append("file",file)
        formData.append("address",JSON.stringify(selectedAddress))
        formData.append("courier",JSON.stringify(selectedCourier))
        dispatch(uploadRecipe(formData))
        handleCloseModal()
    }

    useEffect(() => {
        dispatch(getAddress())
    },[])

    return(
        <div className="container max-w-3xl pt-24">
            <div className="flex flex-col gap-5">
                <h3 className="title">Jasa Pengiriman</h3>
                <ShippingAddress listAddress={address} selectedAddress={selectedAddress} setSelectedAddress={setSelectedAddress} />
                <ShippingCost selectedAddress={selectedAddress} setShipping={setSelectedCourier} />
            </div>
            <div className="flex flex-col gap-5 mt-5">
                <h3 className="title">Upload Resep</h3>
                <span className="title text-md text-slate-500">Foto tidak boleh lebih dari 1Mb.</span>
            </div>
            <InputImage
              file={file}
              setFile={setFile}
              error={error}
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
                        isDanger
                        onClick={onClickYes}
                    />
                </div>
            </Modal>
        </div>
    )
}