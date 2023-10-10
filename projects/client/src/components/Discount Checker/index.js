import { useEffect, useRef, useState } from "react"
import Button from "../Button"
import Modal from "../Modal"
import { useDispatch, useSelector } from "react-redux"
import Input from "../Input"
import { checkerDiscount, getDiscount } from "../../store/slices/discount/slices"
import formatNumber from "../../utils/formatNumber"

export default function DiscountChecker({setDiscount,selectedDiscount,subTotal}) {
    const { listDiscount } = useSelector((state) => {
      return {
        listDiscount: state?.discount?.listDiscount,
      }
    })

    const dispatch = useDispatch()

    const inputRef = useRef()
    const [input,setInput] = useState("")

    const clearFilter = () => {
        setInput("")
        setDiscount(null)
    }

    const [showModal, setShowModal] = useState({ show: false, context: ""})

    const handleShowModal = ({context}) => {
        setShowModal({ show: true, context : context})
        
    }

    const handleCloseModal = () => {
        setShowModal({ show: false, context: "" })
        document.body.style.overflow = "auto"
    }

    useEffect(()=>{
        setDiscount(listDiscount[0])
    },[setDiscount])

    return (
        <div className="flex flex-col gap-3 items-start">
            <div className="flex gap-4">
                {selectedDiscount
                    ? <Input type="button" value={input ? input : selectedDiscount?.discountCode ? selectedDiscount?.discountCode : selectedDiscount?.discountName} />
                    : <Input ref={inputRef} type="text" placeholder="Cari kode" />
                }
                <Button isButton isPrimaryOutline
                    className={selectedDiscount ? "hidden" : ""}
                    onClick={()=>{
                        setInput(inputRef?.current?.value)
                        dispatch(checkerDiscount({"code" : inputRef?.current?.value, "nominal":subTotal}))
                    }}
                > Cari </Button>
                <button className={`flex flex-row items-center h-auto text-red-700 ${selectedDiscount ? "" : "hidden"}`}
                    onClick={clearFilter} 
                >
                    Hapus Kode
                </button>
            </div>
            <Button className="text-primary underline " title="Lihat semua voucher"
                onClick={() =>{
                    dispatch(checkerDiscount({nominal : subTotal}))
                    handleShowModal({context : "Lihat semua voucher"})
                }}
            />
            <Modal 
                showModal={showModal.show}
                closeModal={handleCloseModal}
                title={showModal.context}
            >
                {(showModal.context === "Lihat semua voucher") && (
                    <>
                        {listDiscount?.map((list,index)=>(
                            <Button
                                key={list?.discountId}
                                className={`flex w-full flex-shrink-0 cursor-pointer flex-col rounded-lg px-3 py-3 shadow-lg hover:bg-slate-100 md:py-6  `}
                            >
                                <p className="text-sm font-bold text-dark md:text-base">
                                    {list?.discountName}
                                </p>
                                <p className="text-sm text-dark md:text-base">
                                    {list?.discountDesc}
                                </p>
                                <p className="text-sm text-dark md:text-base">
                                    Potongan : {list?.isPercentage ? `${list?.discountAmount}%` : `Rp. ${formatNumber(list?.discountAmount)}`}
                                </p>
                                <Button
                                    isButton
                                    isPrimary
                                    title="Pilih"
                                    onClick={() =>{
                                        setDiscount(list)
                                        handleCloseModal()
                                    }}
                                />
                            </Button>                        
                        )
                        )}
                    </>
                )}
            </Modal>
        </div>
    )
}