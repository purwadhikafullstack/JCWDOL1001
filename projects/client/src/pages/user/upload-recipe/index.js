import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import Button from "../../../components/Button/index.js"
import InputImage from "../../../components/InputImage"
import Modal from "../../../components/Modal";
import { uploadRecipe } from "../../../store/slices/upload-recipe/slices.js"

export default function UploadRecipePage(){

    const {isLoading} = useSelector(state => {
		return {
			isLoading : state?.uploadRecipe?.isLoading
		}
	})

    const dispatch = useDispatch()

    const navigate = useNavigate()
    
    const [error, setError] = useState("")

    const [file, setFile] = useState(null)

    const [dataImage, setDataImage] = useState(null)

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
        dispatch(uploadRecipe(formData))
        handleCloseModal()
    }

    useEffect(() => {},[isLoading])

    return(
        <div className="container max-w-3xl pt-24">
            <div className="flex flex-col gap-5">
                <span className="title text-2xl">Upload Resep</span>
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
                    title="Upload"
                    onClick={handleShowModal}
                />
            </div>

            <Modal
                showModal={showModal.show}
                closeModal={handleCloseModal}
                title={showModal.context}
            >
                <p className="modal-text">
                    Are you sure you want to upload this image?
                </p>

                <div className="mt-4 flex justify-end gap-2">
                    
                    <Button 
                        title="No" 
                        isButton 
                        isSecondary 
                        onClick={handleCloseModal} 
                    />
                    <Button
                        title="Yes"
                        isButton
                        isDanger
                        onClick={onClickYes}
                    />
                </div>
            </Modal>
        </div>
    )
}