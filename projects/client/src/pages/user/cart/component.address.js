import { useEffect, useRef, useState } from "react"
import Button from "../../../components/Button"
import Modal from "../../../components/Modal"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6"
import InputAddressPage from "../address/page.input.address"
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

    const [addressScroll, setAddressScroll] = useState(0)
    const [maxScroll, setMaxScroll] = useState(0)

    const addressWrapperRef = useRef(null)

    const scrollLeft = () => {
        if (addressWrapperRef.current) {
        addressWrapperRef.current.scrollLeft -= 350
        }
    }

    const scrollRight = () => {
        if (addressWrapperRef.current) {
        addressWrapperRef.current.scrollLeft += 350
        }
    }

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = addressWrapperRef.current.scrollLeft;

            setAddressScroll(currentScroll);

            const maxScrollValue =
                addressWrapperRef.current.scrollWidth -
                addressWrapperRef.current.clientWidth;
                setMaxScroll(maxScrollValue);
            };

            if (addressWrapperRef.current) {
                addressWrapperRef.current.addEventListener("scroll", handleScroll);
                handleScroll();
            }
            
            return () => {
                if (addressWrapperRef.current) {
                    addressWrapperRef.current.removeEventListener("scroll", handleScroll);
                }
            };
    }, []);
    if(isSubmitAddressLoading){
        handleCloseModal()
    }
    return (
        <div>
            <Button
                onClick={()=>{handleShowModal("Daftar Alamat")}}
            >
                Dikirim ke : {selectedAddress.length !== 0 ? ` ${selectedAddress?.contactName} | ${selectedAddress?.address}` : `Pilih Alamat`}
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
                                // onClick={()=>{navigate("/user/address", { state: { from: location } })}}
                            />
                            <div
                                className="address-wrapper flex gap-4 overflow-x-auto scroll-smooth px-2 py-4 "
                            >                                         
                                {listAddress?.map((list,index)=>(
                                    <Button
                                        key={list.addressId}
                                        className={`flex w-48 flex-shrink-0 cursor-pointer flex-col rounded-lg px-3 py-3 shadow-lg hover:bg-slate-100 md:py-6 ${list.addressId == selectedAddress.addressId ? "border-2 border-teal-700" : ""} `}
                                        onClick={()=>{
                                            setSelectedAddress(list)
                                        }}
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
                                        <Button
                                            isButton
                                            isPrimaryOutline
                                            title="Ubah Alamat"
                                            onClick={() =>handleShowModal("Ubah Alamat")}
                                        />
                                    </Button>                        
                                )
                                )}
                                {addressScroll > 0 && (
                                    <div
                                        className="scroll-button absolute left-0 top-1/2 hidden h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-slate-50 text-dark shadow-lg duration-300 hover:bg-slate-200 lg:-left-5 lg:flex"
                                        onClick={scrollLeft}
                                    >
                                        <FaChevronLeft />
                                    </div>
                                )}

                                {addressScroll < maxScroll && maxScroll > 0 && (
                                    <div
                                        className="scroll-button right-button absolute right-0 top-1/2 hidden h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-slate-50 text-dark shadow-lg duration-300 hover:bg-slate-200 lg:-right-5 lg:flex"
                                        onClick={scrollRight}
                                    >
                                        <FaChevronRight />
                                    </div>
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