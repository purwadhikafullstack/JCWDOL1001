import { useEffect, useRef, useState } from "react"
import Button from "../Button"
import Modal from "../Modal"
import { useDispatch, useSelector } from "react-redux"
import Input from "../Input"
import { checkerDiscount, getDiscount } from "../../store/slices/discount/slices"
import formatNumber from "../../utils/formatNumber"
import Pagination from "../PaginationV2"

export default function DiscountChecker({setDiscount,selectedDiscount,subTotal}) {
    const { listDiscount, currentPage, totalPage } = useSelector((state) => {
      return {
        listDiscount: state?.discount?.listDiscount,
        currentPage: state?.discount?.currentPage,
        totalPage: state?.discount?.totalPage,
      }
    })

    const dispatch = useDispatch()

    const inputRef = useRef()
    const [input,setInput] = useState("")
    const [page,setPage] = useState(1)
    const [filter,setfilter] = useState(false)

    const clearFilter = () => {
        setfilter(false)
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
        setDiscount(selectedDiscount)
    },[selectedDiscount])

    useEffect(()=>{
        if(filter === true){
            dispatch(checkerDiscount({"code" : input, "nominal":subTotal})).then((response)=>{
                response?.payload?.type ==="success" && setDiscount(listDiscount[0])
            })
        }
    },[input])

    useEffect(()=>{
        dispatch(checkerDiscount({page:page,nominal : subTotal}))
    },[page,input])
    
    return (
        <div className="flex flex-col gap-3 items-start">
            <div className="flex gap-4">
                {selectedDiscount
                    ? <Input type="button" value={selectedDiscount?.discountCode ? selectedDiscount?.discountCode : input} />
                    : <Input ref={inputRef} type="text" placeholder="Cari kode" />
                }
                <Button isButton isPrimaryOutline
                    className={selectedDiscount ? "hidden" : ""}
                    onClick={()=>{
                        setfilter(true)
                        setInput(inputRef?.current?.value)
                    }}
                > Cari </Button>
                <Button className={`flex flex-row items-center h-auto text-red-700 ${selectedDiscount ? "" : "hidden"}`}
                    onClick={clearFilter} 
                >
                    Hapus Kode
                </Button>
            </div>
            <Button className="text-primary underline " title="Lihat semua voucher"
                onClick={() =>{
                    dispatch(checkerDiscount({page:1,nominal : subTotal}))
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
                        <Pagination
                            currentPage={currentPage}
                            setPage={setPage}
                            totalPage={totalPage}
                        />
                    </>
                )}
            </Modal>
        </div>
    )
}