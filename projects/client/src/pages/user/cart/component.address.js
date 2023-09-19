import { useEffect, useRef, useState } from "react";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";

export default function ShippingAddress({
    listAddress,
    selectedAddress,
    setSelectedAddress,
}) {
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

    return (
        <div>
            <Button
                onClick={()=>{handleShowModal("All Address")}}
            >
                Dikirim ke : {selectedAddress?.contactName} | {selectedAddress?.address}
            </Button>

            <Modal
                showModal={showModal.show}
                closeModal={handleCloseModal}
                title={showModal.context}
            >
                {showModal.context === "All Address" && (
                    <div
                        className="address-wrapper flex gap-4 px-2 py-4"
                    > 
                        {listAddress.map((list)=>(
                            <Button
                                isLink
                                path="/"
                                key={list.addressId}
                                className="flex w-48 flex-shrink-0 cursor-pointer flex-col rounded-lg px-3 py-3 shadow-lg hover:bg-slate-100 md:py-6"
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
                            </Button>                        
                        )
                        )}
                    </div>
                )}
            </Modal>
        </div>
    )
}