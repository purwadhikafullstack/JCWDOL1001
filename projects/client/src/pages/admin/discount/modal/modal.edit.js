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
import { DiscountInfoValidationSchema } from "../../../../store/slices/discount/validation"

export default function ModalDetailsDiscount({selectedId, handleCloseModal, handleShowModal,title,isNew,success}) {
    const dispatch = useDispatch()
    
    const [onEdit, setEdit] = useState(isNew)
    
    const expiredRef = useRef("")
    const [name, setName] = useState(selectedId?.discountName ? selectedId?.discountName : "");
    const [code, setCode] = useState(selectedId?.discountCode ? selectedId?.discountCode : "");
    const [desc, setDesc] = useState(selectedId?.discountDesc ? selectedId?.discountDesc : "");
    const [amount, setAmount] = useState(selectedId?.discountAmount ? selectedId?.discountAmount : "");
    const [minimum, setMinimum] = useState(selectedId?.minimalTransaction ? selectedId?.minimalTransaction : "");
    
    const [isPercentage, setIsPercentage] = useState({
        id : `${selectedId?.isPercentage  ?  1: 0 }`,
        name : `${selectedId?.isPercentage ? "Ya": "Tidak" }`
    })

    const [isOneGetOne, setIsOneGetOne] = useState({
        id : `${selectedId?.oneGetOne ?  1: 0 }`,
        name : `${selectedId?.oneGetOne ? "Ya": "Tidak" }`
    })

    const onButtonCancel = () => {
        if(selectedId.length === 0){ 
            handleCloseModal()
        }else{
            handleShowModal({context:"Detail Diskon", id:selectedId.discountId})
            setEdit(false)
        }
    }

    const [selectedProducts, setSelectedProducts] = useState([]);
    const [error, setError] = useState("")
    const [isToastVisible, setIsToastVisible] = useState(false)
    const output = {}
    
    const onButtonSave = async () => {
        try {
            //minimal transaksi harus ada amount dan code
            if((amount =="" || amount ==0 )  && 
                (minimum !="" || minimum !=0 ) && selectedProducts.length >0
            ){
                throw({inner : [{
                    path : "discountAmount",
                    message:"Potongan diperlukan untuk Minimal transaksi"
                }]}) 
            }
            //(amount dan produk) atau buy one get one tidak perlu kode
            if((code !=="") && 
                ( ( (amount !=="" || amount !=0 ) ) ||  (isOneGetOne.id == 1 ) )
                 &&
                selectedProducts.length > 0
            ){
                throw({inner : [{
                    path : "discountCode",
                    message:"Produk diskon tidak perlu kode"
                }]}) 
            }
            // code harus ada amount atau minimal transaksi 
            if((code ==="" ) && 
                (((amount !=="" || amount !=0 ) ) ||
                ((minimum !=="" || minimum !=0 ) )) &&
                selectedProducts.length === 0
            ){
                throw({inner : [{
                    path : "discountCode",
                    message:"Kode dibutuhkan"
                }]}) 
            }
            if(isOneGetOne.id == 1 && selectedProducts.length == 0 ){
                throw({inner : [{
                    path : "product",
                    message:"Produk dibutuhkan"
                }]}) 
            }
            if((code !=="" || desc !=="") && (amount ==""||amount==0)&&isOneGetOne.id ==0){
                throw({inner : [{
                    path : "discountAmount",
                    message:"Potongan diperlukan"
                }]}) 
            }

            output.data = {
                "discountDesc" : desc,
                "isPercentage" : +isPercentage.id,
                "discountAmount" : amount,
                "discountExpired" : expiredRef?.current?.value ? expiredRef?.current?.value : selectedId?.discountExpired,
                "oneGetOne" : +isOneGetOne.id,
                "minimalTransaction" : minimum =="" ? null : minimum,
                "discountName" : name,
                "discountCode" : code =="" ? null : code,
            }

            output.products = selectedProducts.map(({productId, detailProduct, productPrice}) => { return { productId, productPrice : detailProduct?.productPrice ? detailProduct?.productPrice : productPrice}})
            
            await DiscountInfoValidationSchema.validate(output.data,{
                abortEarly:false
            })

            if(!selectedId || selectedId.length ==0){
                dispatch(createDiscount(output))
            }else {
                dispatch(updateDiscount({discountId : selectedId?.discountId,output}))
            }
        }catch(error){
            const errors = {}
            
            error.inner.forEach((innerError) => {
                errors[innerError.path] = innerError.message;
            })
            
            setError(errors)

            toast.error("Periksa kolom pengisian!")

            setIsToastVisible(true)

            setTimeout(() => {
                setIsToastVisible(false)
            }, 2000)
        }
    }

    const width = window.screen.width
    const mobileWidth = 414

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
    <div className={`flex  ${width <= mobileWidth ? "h-[90vh]" : "max-h-[75vh]"} flex-col overflow-auto px-2`}>
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
                isDisabled={isToastVisible}
                onClick = {onButtonSave}
            />
        </div>
        <div className={`flex ${width <= mobileWidth ? "flex-col w-fit" : "max-w-[85%] gap-8 items-center justify-between"}    `}>
            <div className="">
                <h4 className={`title font-bold ${onEdit ? "mt-2" : "mt-4" }`}>Nama : </h4>
                <Input
                    type = {`${!onEdit ? "hidden" : "text" }`}
                    value={name}
                    onChange={(e) => {
                        setError({ ...error, discountName: false })
                        setName(e.target.value)
                    }}
                />
                {error.discountName && (
                    <div className="text-sm text-red-500 dark:text-red-400">
                        {error.discountName}
                    </div>
                )}
                <h1 className={`${onEdit ? "hidden" : "title" }`}>| {selectedId?.discountName}</h1>
                <h4 className="title font-bold mt-4">Deskripsi : </h4>
                <Input
                    type = {`${!onEdit ? "hidden" : "textarea" }`}
                    value = {desc}
                    errorInput={error.discountDesc }
                    onChange={(e) => {
                        setError({ ...error, discountDesc: false })
                        setDesc(e.target.value)
                    }}
                />
                {error.discountDesc && (
                    <div className="text-sm text-red-500 dark:text-red-400">
                        {error.discountDesc}
                    </div>
                )}
                <h1 className={`${onEdit ? "hidden" : "title" }`}>| {selectedId?.discountDesc}</h1>
                <h4 className={`title font-bold ${onEdit ? "mt-5" : "mt-4" }`}>Persentase : </h4>
                <h1 className={`${onEdit ? "hidden" : "title" }`}>| {selectedId?.isPercentage ? "Ya" : "Tidak" }</h1>
                <fieldset className={`${onEdit ? "pt-3 pb-1" : "hidden"}`} id="percentage">
                    <div>
                        <input
                            type="radio"
                            id="1"
                            name="isPercentage"
                            value="Ya"
                            checked = {isPercentage?.name === "Ya" ? true : false}
                            onChange={()=>{setIsPercentage({id:"1",name:"Ya"});setIsOneGetOne({id:"0",name:"Tidak"})}}
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
                <h4 className="title font-bold mt-4">Beli Satu Gratis Satu : </h4>
                <h1 className={`${onEdit ? "hidden" : "title" }`}>| {selectedId?.oneGetOne ? "Ya" : "Tidak" }</h1>
                <fieldset className={`${onEdit ? "pt-3 z-50" : "hidden"}`} id="oneGetOne">
                    <div>
                        <input
                            type="radio"
                            id="1"
                            name="isOneGetOne"
                            value="Ya"
                            checked = {isOneGetOne?.name === "Ya" ? true : false}
                            onChange={() => {
                                setAmount("")
                                setMinimum("")
                                setCode("")
                                setError({ ...error, discountAmount: false, minimalTransaction:false })
                                setIsPercentage({id:"0",name:"Tidak"})
                                setIsOneGetOne({id:"1",name:"Ya"})
                            }}
                            
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
                <h4 className="title font-bold mt-4">Kode : </h4>
                <Input
                    isDisabled={isOneGetOne.id == 1}
                    type = {`${!onEdit ? "hidden" : "text" }`}
                    value = {code}
                    errorInput={error.discountCode }
                    onChange={(e) => {
                        setError({ ...error, discountCode: false })
                        setCode(e.target.value)
                    }}
                />
                {error.discountCode && (
                    <div className="text-sm text-red-500 dark:text-red-400">
                        {error.discountCode}
                    </div>
                )}
                <h1 className={`${onEdit ? "hidden" : "title" }`}>| {selectedId?.discountCode ? selectedId?.discountCode : "-"}</h1>
                <h4 className="title font-bold mt-4">Tanggal Berakhir : </h4>
                <input 
                    type = {`${!onEdit ? "hidden" : "date" }`}
                    ref = {expiredRef}
                    defaultValue = {selectedId?.discountExpired ? formatDateValue(selectedId?.discountExpired).toString() : "-"}
                    className="w-full rounded-lg border bg-inherit px-2 py-2  focus:ring-2"
                />
                <h1 className={`${onEdit ? "hidden" : "title" }`}>| {selectedId?.discountExpired ? formatDate(selectedId?.discountExpired) : "-"}</h1>
                <h4 className="title font-bold mt-4">Jumlah : </h4>
                <Input 
                    isDisabled={isOneGetOne.id == 1}
                    type = {`${!onEdit ? "hidden" : "number" }`}
                    value = {amount}
                    errorInput={error.discountAmount }
                    onChange={(e) => {
                        setError({ ...error, discountAmount: false })
                        setAmount(e.target.value)
                    }}
                />
                {error.discountAmount && (
                    <div className="text-sm text-red-500 dark:text-red-400">
                        {error.discountAmount}
                    </div>
                )}
                <h1 className={`${onEdit ? "hidden" : "title" }`}>| {selectedId?.isPercentage ? `${selectedId?.discountAmount}%` : `Rp. ${formatNumber(selectedId?.discountAmount)}` }</h1>
                <h4 className="title font-bold mt-4">Minimal Transaksi : </h4>
                <Input 
                    isDisabled={isOneGetOne.id == 1}
                    type = {`${!onEdit ? "hidden" : "number" }`}
                    value = {minimum}
                    errorInput={error.minimalTransaction }
                    onChange={(e) => {
                        setError({ ...error, minimalTransaction: false })
                        setMinimum(e.target.value)
                    }}
                />
                {error.minimalTransaction && (
                    <div className="text-sm text-red-500 dark:text-red-400">
                        {error.minimalTransaction}
                    </div>
                )}
                <h1 className={`${onEdit ? "hidden" : "title" }`}>| {!selectedId?.minimalTransaction ? "-" : `Rp. ${formatNumber(selectedId?.minimalTransaction)}` }</h1>
            </div>
        </div>       
        <ProductList title={title} dataDiscount={selectedId} onEdit={onEdit} selectedProducts={selectedProducts} setSelectedProducts={setSelectedProducts} setError={setError} error={error}/>
    </div>
  )
}