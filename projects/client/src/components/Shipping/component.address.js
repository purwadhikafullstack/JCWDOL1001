import { useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Button from "../Button"
import Modal from "../Modal"
import Message from "../Message"
import InputAddressPage from "../../pages/user/address/page.input.address"
import { getAddress, resetSuccessAddress } from "../../store/slices/address/slices"
import Pagination from "../PaginationV2"
import Input from "../Input"
import { HiMagnifyingGlass } from "react-icons/hi2"

export default function ShippingAddress({
    setPage,
    totalPage,
    currentPage,
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

    const width = window.screen.width
    const mobileWidth = 414
    
    const nameRef = useRef()

    const [filter,setFilter] = useState(false)

    const onButtonSearchName = () =>{
       dispatch( getAddress({page:1, name:nameRef?.current?.value}))
    }
    
    const clearFilter = () => {
        nameRef.current.value = ""
        dispatch( getAddress({page:1}))
        setFilter(false)
    }
    if (success) {
        return (
            <Modal
                showModal={true}
                closeModal={handleCloseModal}
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
                            <div className={`flex ${width <= mobileWidth ? "flex-col w-full" : "items-center "} gap-5 px-3 mb-5 mt-3`}>
                                <Button
                                    className={width > mobileWidth && "align-middle"}
                                    isButton
                                    isPrimary
                                    title="Tambah Alamat Baru"
                                    onClick={()=>{handleShowModal("Tambah Alamat Baru")}}
                                />
                                <Input type="text" placeholder="Cari Penerima" ref={nameRef} className="w-fit"/>
                                <Button className={`absolute ${filter && width <= mobileWidth ? "top-[12.2%] right-[8%]" : width <= mobileWidth ? "top-[13.2%] right-[8%]" : " top-[2.2%] right-[42.5%]"}`}
                                    onClick={()=>{
                                        onButtonSearchName()
                                        setFilter(true)}}
                                >
                                    <HiMagnifyingGlass className="text-2xl text-primary" />
                                </Button>
                                <Button title="Hapus pengaturan" onClick={clearFilter}  className={`flex flex-row items-center h-auto text-red-700 ${filter ? "" : "hidden"}`} />
                            </div>
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
                    :""
                }

                <div className={`mt-4 flex justify-center ${(showModal.context === "Tambah Alamat Baru" || showModal.context === "Ubah Alamat") && "hidden"}`}>
                    <Pagination
                        currentPage={currentPage}
                        setPage={setPage}
                        totalPage={totalPage}
                    />
                </div>
            </Modal>
        </div>
    )
}