import {useDispatch, useSelector} from "react-redux"
import { useEffect, useRef } from "react"
import { useState } from "react"
import { HiMagnifyingGlass} from "react-icons/hi2"
import Button from "../../../components/Button/index.js"
import { getDiscount } from "../../../store/slices/discount/slices.js"
import Input from "../../../components/Input/index.js"
import Pagination from "../../../components/Pagination/index.js"
import Modal from "../../../components/Modal/index.js"
import TableDiscount from "./table.discount.js"
import ModalDeleteDiscount from "./modal/modal.delete.js"
import ModalDetailsDiscount from "./modal/modal.edit.js"
import { getProducts } from "../../../store/slices/product/slices.js"

export default function DiscountPage(){

    const { discountList, totalPage, currentPage, success,isDeleteLoading, products } = useSelector((state) => {
        return {
            discountList : state?.discount?.data,
            totalPage : state?.discount?.totalPage,
            currentPage : state?.discount?.currentPage,
            success : state?.discount?.success,
            isDeleteLoading : state?.discount?.isDeleteLoading,
            products : state?.products?.data,
        }
    })

    const dispatch = useDispatch()

    const discountRef = useRef()

    const [showModal, setShowModal] = useState({ show: false, context: "", name: "", id: "", isNew:false })

    const [selectedId, setSelected] = useState()

    const handleShowModal = ({context, name, id, isNew}) => {
        setShowModal({ show: true, context, name, id, isNew : isNew})
        
        dispatch(getDiscount({page : currentPage,discountName : discountRef?.current.value}))
        
        if(id){
            const selectedDiscount = discountList.find((discount)=> discount.discountId === id)
            setSelected(selectedDiscount)
        }
    }

    const handleCloseModal = () => {
        setShowModal({ show: false, context: "" })
        setSelected([])
        dispatch( getDiscount({page : currentPage,discountName : discountRef?.current.value}))
        dispatch(getProducts({page:0}))
        document.body.style.overflow = "auto"
    };

    const onChangePagination = (type) => {
        dispatch(
            getDiscount({ 
                page : type === "prev" ? Number(currentPage) - 1 : Number(currentPage) + 1, 
                discountName : discountRef?.current.value
            })
        )
    }

    useEffect(()=>{
        dispatch(
            getDiscount({page : currentPage,discountName : discountRef?.current.value})
        )
        dispatch(getProducts({page:0}))
    },[])

    return(
        <>
            <div className="container py-24 lg:ml-[calc(5rem)] lg:px-8">
                <div className="mt-4 flex flex-col items-left justify-left pb-2">
                    <h3 className=" text-2xl font-semibold w-full border-b-2 mb-5 pb-2">
                        Discount
                    </h3>
                    <form className="relative w-fit flex gap-4">
                        <Button
                            isButton
                            isPrimary
                            className="lg:justify-self-start"
                            title="Tambah Baru"
                            onClick={() =>
                                handleShowModal({context:"Tambah Baru", isNew :true})
                            }
                        />
                        <Input 
                            type="text" 
                            placeholder="Cari" 
                            className=""
                            ref={discountRef}
                        />
                        <Button 
                            className="absolute top-1/2 right-0 -translate-y-1/2 p-2" 
                            onClick={()=>dispatch(getDiscount({discountName : discountRef?.current.value}))}
                        >
                        <HiMagnifyingGlass className="text-2xl text-primary" />
                        </Button>
                    </form>
                </div>
                <TableDiscount discountList={discountList} handleShowModal={handleShowModal}/>
                <div className="mt-4 flex items-center justify-center text-center text-green-900 text-lg">
                    <Pagination 
                        onChangePagination={onChangePagination}
                        disabledPrev={Number(currentPage) === 1}
                        disabledNext={currentPage >= totalPage}
                        currentPage={currentPage}
                    />
                </div>
                <Modal
                    showModal={showModal.show}
                    closeModal={handleCloseModal}
                    title={showModal.context}
                    disableOutside
                >
                    {showModal.context === "Hapus Diskon" && (
                        <ModalDeleteDiscount
                            selectedDiscount={selectedId}
                            success={success}
                            handleCloseModal={handleCloseModal}
                            isDeleteLoading={isDeleteLoading}
                        />
                    )}

                    {(showModal.context === "Detail Diskon" || 
                        showModal.context === "Tambah Baru") && (
                        <ModalDetailsDiscount
                            selectedId={selectedId}
                            handleCloseModal={handleCloseModal}
                            handleShowModal={handleShowModal}
                            products ={products}
                            isNew={showModal.isNew}
                            success={success}
                        />
                    )}

                </Modal>
            </div>
        </>
    )
}