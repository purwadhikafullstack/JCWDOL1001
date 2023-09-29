import React, { useEffect, useRef, useState } from "react"
import formatNumber from "../../../../utils/formatNumber"
import Button from "../../../../components/Button"
import Input from "../../../../components/Input"
import { useDispatch, useSelector } from "react-redux"
import ProductList from "./product.list"
import { createDiscount, updateDiscount } from "../../../../store/slices/discount/slices"
import SuccessMessage from "../../../../components/Message"
import {formatDate, formatDateValue} from "../../../../utils/formatDate"
import { toast } from "react-toastify"

export default function ModalDetailsDiscount({selectedId, handleCloseModal, handleShowModal,products,isNew,success}) {
    const dispatch = useDispatch()
    const nameRef = useRef("")
    const codeRef = useRef("")
    const descRef = useRef("")
    const expiredRef = useRef("")
    const amountRef = useRef("0")
    const minimumRef = useRef("0")

    const [onEdit, setEdit] = useState(isNew)
    
    const [isPercentage, setIsPercentage] = useState({
        id : `${selectedId?.isPercentage ?  1: 0 }`,
        name : `${selectedId?.isPercentage ? "Ya": "Tidak" }`
    })

    const [isOneGetOne, setIsOneGetOne] = useState({
        id : `${selectedId?.oneGetOne ?  1: 0 }`,
        name : `${selectedId?.oneGetOne ? "Ya": "Tidak" }`
    })

    const onButtonCancel = () => {
        if(!selectedId){ handleCloseModal()}
        handleShowModal({context:"Detail Diskon", id:selectedId.discountId})
        setEdit(false)
    }

    const [selectedProducts, setSelectedProducts] = useState([]);
    const output = {}

    const onButtonSave = async () => {
        try {
            // minimum transaksi atau produk buy one get one harus ada kode voucher
            if(
                (
                    ( (amountRef?.current?.value === "" || amountRef?.current?.value == "0" ) && (minimumRef?.current?.value !== "" || minimumRef?.current?.value != "0" ) )
                    || (isOneGetOne.id === 1)
                )
                && codeRef?.current?.value === ""
            ){
                return toast.error("Voucher code can't be empty")
            }
            
            // minimum transaction harus ada amount utk dipotong
            if((minimumRef?.current?.value !== "" || minimumRef?.current?.value != "0" ) && (amountRef?.current?.value === "" || amountRef?.current?.value == "0" )){
                return toast.error("Minimum transaction voucher must have a reduced amount")
            }

            // buy one get one harus ada produk
            if(isOneGetOne.id === 1 && selectedProducts.length === 0 ){
                return toast.error("Buy One Get One must have product")
            }
            
            output.data = {
                "discountDesc" : descRef?.current?.value ? descRef?.current?.value : selectedId?.discountDesc,
                "isPercentage" : isPercentage.id ,
                "discountAmount" : amountRef?.current?.value ? amountRef?.current?.value : selectedId?.discountAmount,
                "discountExpired" : expiredRef?.current?.value ? expiredRef?.current?.value : selectedId?.discountExpired,
                "oneGetOne" : isOneGetOne.id,
                "minimalTransaction" : minimumRef?.current?.value ? minimumRef?.current?.value : selectedId?.minimalTransaction,
                "discountName" : nameRef?.current?.value ? nameRef?.current?.value : selectedId?.discountName,
                "discountCode" : codeRef?.current?.value ? codeRef?.current?.value : selectedId?.discountCode
            }
            output.products = selectedProducts.map(({productId, detailProduct, productPrice}) => { return { productId, productPrice : detailProduct?.productPrice ? detailProduct?.productPrice : productPrice}})
            if(!selectedId || selectedId.length ==0){
                dispatch(createDiscount(output))
            }else {
                dispatch(updateDiscount({discountId : selectedId?.discountId,output}))
            }
        }catch(error){}
    }
    useEffect(() => {
        setSelectedProducts(selectedId?.productDiscount ? selectedId?.productDiscount:[]);
    }, [])
    if (success) {  
        return ( 
            <SuccessMessage 
                type="success" 
                message={`${selectedId ? "Berhasil mengubah diskon" : "Berhasil menambahkan diskon baru!"}`} 
                handleCloseModal={handleCloseModal} 
            /> 
        ) 
    }
  return (
    <div className="flex max-h-[75vh] flex-col overflow-auto px-2">
        <Button
            isButton
            isPrimary
            className = {`${onEdit ? "hidden" : "lg:justify-self-start w-fit" }`}
            title = "Ubah"
            onClick = {()=> setEdit(true)}
        />
        <div className=" flex gap-3">
            <Button
                isButton
                isDanger
                className = {`${!onEdit ? "hidden" : "lg:justify-self-start w-fit" }`}
                title = "Kembali"
                onClick = {onButtonCancel}
            />
            <Button
                isButton
                isPrimary
                className = {`${!onEdit ? "hidden" : "lg:justify-self-start w-fit" }`}
                title = "Simpan"
                onClick = {onButtonSave}
            />
        </div>
        <div className="flex items-center justify-between max-w-[80%] gap-8">
            <div className="">
                <h3 className={`${onEdit ? "title mt-2" : "title mt-4" }`}>Nama : </h3>
                <Input 
                    type = {`${!onEdit ? "hidden" : "text" }`}
                    ref = {nameRef}
                    placeholder = {selectedId?.discountName}
                />
                <h1 className={`${onEdit ? "hidden" : "title" }`}>| {selectedId?.discountName}</h1>
                <h3 className="title mt-4">Deskripsi : </h3>
                <Input 
                    type = {`${!onEdit ? "hidden" : "textarea" }`}
                    ref = {descRef}
                    placeholder = {selectedId?.discountDesc}
                />
                <h1 className={`${onEdit ? "hidden" : "title" }`}>| {selectedId?.discountDesc}</h1>
                <h3 className={`${onEdit ? "title mt-5" : "title mt-4" }`}>Persentase : </h3>
                <h1 className={`${onEdit ? "hidden" : "title" }`}>| {selectedId?.isPercentage ? "Ya" : "Tidak" }</h1>
                <fieldset className={`${onEdit ? "pt-3" : "hidden"}`} id="percentage">
                    <div>
                        <input
                            type="radio"
                            id="1"
                            name="isPercentage"
                            value="Ya"
                            checked = {isPercentage?.name === "Ya" ? true : false}
                            onChange={()=>{setIsPercentage({id:"1",name:"Ya"})}}
                        />
                        <label for="1" className="mr-4">Ya</label>
                        <input 
                            type="radio" 
                            id="0" 
                            name="isPercentage" 
                            value="Tidak" 
                            checked = {isPercentage?.name === "Tidak" ? true : false}
                            onChange={()=>{setIsPercentage({id:"0",name:"Tidak"})}}
                        />
                        <label for="0">Tidak</label>
                    </div>
                </fieldset>
                <h3 className="title mt-4">Beli Satu Gratis Satu : </h3>
                <h1 className={`${onEdit ? "hidden" : "title" }`}>| {selectedId?.oneGetOne ? "Ya" : "Tidak" }</h1>
                <fieldset className={`${onEdit ? "pt-3" : "hidden"}`} id="oneGetOne">
                    <div>
                        <input
                            type="radio"
                            id="1"
                            name="isOneGetOne"
                            value="Ya"
                            checked = {isOneGetOne?.name === "Ya" ? true : false}
                            onChange={()=>{setIsOneGetOne({id:"1",name:"Ya"})}}
                            
                        />
                        <label for="1" className="mr-4">Ya</label>
                        <input 
                            type="radio" 
                            id="0" 
                            name="isOneGetOne" 
                            value="Tidak" 
                            checked = {isOneGetOne?.name === "Tidak" ? true : false}
                            onChange={()=>{setIsOneGetOne({id:"0",name:"Tidak"})}}
                        />
                        <label for="0">Tidak</label>
                    </div>
                </fieldset>
            </div>
            <div className="">
                <h3 className="title mt-4">Kode : </h3>
                <Input 
                    type = {`${!onEdit ? "hidden" : "text" }`}
                    ref = {codeRef}
                    placeholder = {selectedId?.discountCode ? selectedId?.discountCode : "-"}
                />
                <h1 className={`${onEdit ? "hidden" : "title" }`}>| {selectedId?.discountCode ? selectedId?.discountCode : "-"}</h1>
                <h3 className="title mt-4">Tanggal Berakhir : </h3>
                <input 
                    type = {`${!onEdit ? "hidden" : "date" }`}
                    ref = {expiredRef}
                    defaultValue = {selectedId?.discountExpired ? formatDateValue(selectedId?.discountExpired).toString() : "-"}
                    className="w-full rounded-lg border bg-inherit px-2 py-2  focus:ring-2"
                />
                <h1 className={`${onEdit ? "hidden" : "title" }`}>| {selectedId?.discountExpired ? formatDate(selectedId?.discountExpired) : "-"}</h1>
                <h3 className="title mt-4">Jumlah : </h3>
                <Input 
                    type = {`${!onEdit ? "hidden" : "number" }`}
                    ref = {amountRef}
                    placeholder = {(selectedId?.isPercentage || isPercentage.id ==1) ? `${selectedId?.discountAmount ? selectedId?.discountAmount :"0"}%` : `IDR ${formatNumber(selectedId?.discountAmount ? selectedId?.discountAmount : "0")}` }
                />
                <h1 className={`${onEdit ? "hidden" : "title" }`}>| {selectedId?.isPercentage ? `${selectedId?.discountAmount}%` : `IDR ${formatNumber(selectedId?.discountAmount)}` }</h1>
                <h3 className="title mt-4">Minimal Transaksi : </h3>
                <Input 
                    type = {`${!onEdit ? "hidden" : "number" }`}
                    ref = {minimumRef}
                    placeholder = {!selectedId?.minimalTransaction ? "-" : `IDR ${formatNumber(selectedId?.discountAmount)}` }
                />
                <h1 className={`${onEdit ? "hidden" : "title" }`}>| {!selectedId?.minimalTransaction ? "-" : `IDR ${formatNumber(selectedId?.discountAmount)}` }</h1>
            </div>
        </div>
        <ProductList dataDiscount={selectedId} onEdit={onEdit} selectedProducts={selectedProducts} setSelectedProducts={setSelectedProducts} />
    </div>
  )
}