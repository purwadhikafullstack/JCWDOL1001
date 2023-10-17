import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Button from "../Button"
import Modal from "../Modal"
import Message from "../Message"
import InputAddressPage from "../../pages/user/address/page.input.address"
import { getAddress, resetSuccessAddress } from "../../store/slices/address/slices"

export default function ShippingAddress({
    listAddress,
    selectedAddress,
    setSelectedAddress,
}) {
    const { success } = useSelector((state) => {
      return {
        success: state?.address?.success,
      }
    })

    const dispatch = useDispatch()

    const [showModal, setShowModal] = useState({ show: false, context: ""})

    const handleShowModal = (context) => {
        setShowModal({ show: true, context : context})
    }

    const handleCloseModal = () => {
        setShowModal({ show: false, context: "" })
        document.body.style.overflow = "auto"
    }
    
    if (success) {
        return (
            <Modal
                showModal={true}
                closeModal={handleCloseModal}
                title={"Success"}
            >
                <Message
                    type="success"
                    message={
                    `${showModal.context === "Tambah Alamat Baru" ? "Alamat berhasil ditambahkan" : "Alamat berhasil diubah"}`}
                    handleCloseModal={()=>{
                        handleShowModal("Daftar Alamat")
                        dispatch(resetSuccessAddress())
                        dispatch(getAddress())
                    }}
                />
            </Modal>
        );
    }

    return (
        <div className="flex flex-col ">
            <a>Dikirim ke :</a>
            <Button
                className="border-2 rounded-lg w-fit p-2"
                onClick={()=>{handleShowModal("Daftar Alamat")}}
            >
                 {selectedAddress?.length !== 0 && selectedAddress !== undefined ? ` ${selectedAddress?.contactName} | ${selectedAddress?.address}` : `Pilih Alamat`}
            </Button>

            <Modal
                showModal={showModal.show}
                closeModal={handleCloseModal}
                title={showModal.context}
            >
                {showModal.context === "Daftar Alamat" && (
                    <>
                        <div className="relative">
                            <Button
                                className="mt-2"
                                isButton
                                isPrimary
                                title="Tambah Alamat Baru"
                                onClick={()=>{handleShowModal("Tambah Alamat Baru")}}
                            />
                            <div
                                className="h-96 flex flex-col gap-4 overflow-y-scroll scroll-smooth px-2 py-4 mt-3"
                            >                       
                                {listAddress?.filter((list)=>{return list?.isDeleted === 0}).map((list)=>(
                                    <Button
                                        key={list?.addressId}
                                        className={`flex w-full flex-shrink-0 cursor-pointer flex-col rounded-lg px-3 py-3 shadow-lg hover:bg-slate-100 md:py-6 ${list?.addressId == selectedAddress?.addressId ? "border-2 border-teal-700" : ""} `}
                                    >
                                        <p className="text-sm font-bold text-dark md:text-base">
                                            {list?.contactName}
                                        </p>
                                        <p className="text-sm text-dark md:text-base">
                                            {list?.contactPhone}
                                        </p>
                                        <p className="text-sm text-dark md:text-base">
                                            {list?.address}
                                        </p>
                                        <div className="flex gap-4 mt-4">
                                            <Button
                                                isButton
                                                isPrimary
                                                title="Pilih"
                                                onClick={() =>{
                                                    setSelectedAddress(list)
                                                    handleCloseModal()
                                                }}
                                            />
                                            <Button
                                                isButton
                                                isPrimaryOutline
                                                title="Ubah Alamat"
                                                onClick={() =>{
                                                    handleShowModal("Ubah Alamat")
                                                    setSelectedAddress(list)
                                                }}
                                            />
                                        </div>
                                    </Button>                        
                                )
                                )}
                            </div>
                        </div>
                    </>
                )}

                {showModal.context === "Tambah Alamat Baru" || showModal.context === "Ubah Alamat" && !success ?
                    <InputAddressPage
                        addressData={showModal.context === "Tambah Alamat Baru" ? [] : selectedAddress}
                        handleCloseAddressPageAction={()=>{handleShowModal("Daftar Alamat")}}
                    />
                    // : showModal.context === "success" ?
                    // <Message
                    //     type="success"
                    //     message={
                    //     `${showModal.context === "Tambah Alamat Baru" ? "Alamat berhasil ditambahkan" : "Alamat berhasil diubah"}`}
                    //     handleCloseModal={()=>{handleShowModal("Daftar Alamat")}}
                    // />
                    :""
                }
            </Modal>
        </div>
    )
}