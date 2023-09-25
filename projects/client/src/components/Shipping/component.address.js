import { useState } from "react"
import Button from "../Button"
import Modal from "../Modal"
import InputAddressPage from "../../pages/user/address/page.input.address"
import { useSelector } from "react-redux"

export default function ShippingAddress({
    listAddress,
    selectedAddress,
    setSelectedAddress,
}) {
    const { isSubmitAddressLoading } = useSelector((state) => {
      return {
        isSubmitAddressLoading: state?.address?.isSubmitAddressLoading,
      }
    })

    const [showModal, setShowModal] = useState({ show: false, context: ""})

    const handleShowModal = (context) => {
        setShowModal({ show: true, context : context,})
    }

    const handleCloseModal = () => {
        setShowModal({ show: false, context: "" })
        document.body.style.overflow = "auto"
    }

    if(isSubmitAddressLoading){
        handleCloseModal()
    }
    return (
        <div>
            <Button
                onClick={()=>{handleShowModal("Daftar Alamat")}}
            >
                Dikirim ke : {selectedAddress?.length !== 0 ? ` ${selectedAddress?.contactName} | ${selectedAddress?.address}` : `Pilih Alamat`}
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
                                isButton
                                isPrimary
                                title="Tambah Alamat Baru"
                                onClick={()=>{handleShowModal("Tambah Alamat Baru")}}
                            />
                            <div
                                className="h-96 flex flex-col gap-4 overflow-y-scroll scroll-smooth px-2 py-4 mt-3"
                            >                                         
                                {listAddress?.map((list,index)=>(
                                    <Button
                                        key={list.addressId}
                                        className={`flex w-full flex-shrink-0 cursor-pointer flex-col rounded-lg px-3 py-3 shadow-lg hover:bg-slate-100 md:py-6 ${list.addressId == selectedAddress.addressId ? "border-2 border-teal-700" : ""} `}
                                    >
                                        <p className="text-sm font-bold text-dark md:text-base">
                                            {list.contactName}
                                        </p>
                                        <p className="text-sm text-dark md:text-base">
                                            {list.contactPhone}
                                        </p>
                                        <p className="text-sm text-dark md:text-base">
                                            {list.address}
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
                                                onClick={() =>handleShowModal("Ubah Alamat")}
                                            />
                                        </div>
                                    </Button>                        
                                )
                                )}
                            </div>
                        </div>
                    </>
                )}

                {showModal.context === "Tambah Alamat Baru" || showModal.context === "Ubah Alamat" ?
                    <InputAddressPage
                        addressData={showModal.context === "Tambah Alamat Baru" ? [] : selectedAddress}
                        handleCloseAddressPageAction={()=>{handleShowModal("Daftar Alamat")}}
                    />
                    :""
                }
            </Modal>
        </div>
    )
}