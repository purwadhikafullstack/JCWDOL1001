import {useDispatch, useSelector} from "react-redux"
import { useEffect, useRef } from "react"
import { useState } from "react"
import { HiMagnifyingGlass} from "react-icons/hi2"
import Button from "../../../components/Button/index.js"
import { getDiscount } from "../../../store/slices/discount/slices.js"
import Input from "../../../components/Input/index.js"
import Pagination from "../../../components/PaginationV2/index.js"
import Modal from "../../../components/Modal/index.js"
import TableDiscount from "./table.discount.js"
import ModalDeleteDiscount from "./modal/modal.delete.js"
import ModalDetailsDiscount from "./modal/modal.edit.js"
import { getProducts } from "../../../store/slices/product/slices.js"

export default function DiscountPage(){
    
    const { discountList, totalPage, currentPage, success,isDeleteLoading,limit, products } = useSelector((state) => {
        return {
            discountList : state?.discount?.data,
            totalPage : state?.discount?.totalPage,
            currentPage : state?.discount?.currentPage,
            limit : state?.discount?.limit,
            success : state?.discount?.success,
            isDeleteLoading : state?.discount?.isDeleteLoading,
            products : state?.products?.data,
        }
    })
    
    const dispatch = useDispatch()
    
    const discountRef = useRef()
    
    const [showModal, setShowModal] = useState({ show: false, context: "", name: "", id: "", isNew:false })
    
    const [selectedId, setSelected] = useState()
    
    const [search,setSearch] = useState(false)
    
    const [page, setPage] = useState(1);

    const handleShowModal = ({context, name, id, isNew}) => {
        setShowModal({ show: true, context, name, id, isNew : isNew})
        
        dispatch(getDiscount({page : currentPage,discountName : discountRef?.current.value,limit:""}))
        
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

    const clearSearch = () => {
        discountRef.current.value = ""
        dispatch( getDiscount({page : page}) )
        setSearch(false)
    }
    
    const width = window.screen.width
    const mobileWidth = 414

    useEffect(() => {
        dispatch(
            getDiscount({page : page,discountName : discountRef?.current.value,limit:""})
        )
    }, [page])

    return(
        <>
            <div className="container py-24 lg:ml-[calc(5rem)] lg:px-8">
                <div className="mt-4 flex flex-col items-left justify-left pb-2">
                    <h3 className="title w-full border-b-2 mb-5 pb-2">
                        Daftar Diskon 
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
                            placeholder="Cari Nama Diskon" 
                            className=""
                            ref={discountRef}
                        />
                        <Button 
                            className={`absolute top-1/2 -translate-y-1/2 p-2 ${search ? " right-[153px]" : "right-0"}`}
                            onClick={()=>{
                                dispatch(getDiscount({discountName : discountRef?.current.value}))
                                setSearch(true)
                            }}
                        >
                        <HiMagnifyingGlass className="text-2xl text-primary" />
                        </Button>
                    <Button title="Hapus pengaturan" onClick={clearSearch}  className={`flex flex-row items-center h-auto text-red-700 ${search ? "" : "hidden"}`} />
                    </form>
                </div>
                    <TableDiscount limit={limit} currentPage={currentPage} discountList={discountList} handleShowModal={handleShowModal}/>
                <div className="mt-4 flex items-center justify-center text-center text-green-900 text-lg">
                    <Pagination currentPage={currentPage} totalPage={totalPage} setPage={setPage}/>
                </div>
                <Modal
                    fullWidth={width <= mobileWidth}
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
                            title={showModal.context}
                            selectedId={selectedId}
                            handleCloseModal={handleCloseModal}
                            handleShowModal={handleShowModal}
                            isNew={showModal.isNew}
                            success={success}
                        />
                    )}

                </Modal>
            </div>
        </>
    )
}