import React, { useEffect, useRef, useState } from "react"
import formatNumber from "../../../../utils/formatNumber"
import Button from "../../../../components/Button"
import Input from "../../../../components/Input"
import { useDispatch, useSelector } from "react-redux"
import ProductList from "./product.list"
import { createDiscount, updateDiscount } from "../../../../store/slices/discount/slices"

export default function ModalDetailsDiscount({selectedId, handleCloseModal, handleShowModal,products,isNew}) {
    const dispatch = useDispatch()

    const nameRef = useRef()
    const codeRef = useRef()
    const descRef = useRef()
    const expiredRef = useRef()
    const amountRef = useRef()
    const minimumRef = useRef()

    const [onEdit, setEdit] = useState(isNew)

    const [isPercentage, setIsPercentage] = useState({
        id : `${selectedId?.isPercentage ?  1: 0 }`,
        name : `${selectedId?.isPercentage ? "yes": "no" }`
    })

    const [isOneGetOne, setIsOneGetOne] = useState({
        id : `${selectedId?.oneGetOne ?  1: 0 }`,
        name : `${selectedId?.oneGetOne ? "yes": "no" }`
    })

    const onButtonCancel = () => {
        if(!selectedId){
            handleCloseModal()
        }
        handleShowModal({context:"Details Discount", id:selectedId.discountId})
        setEdit(false)
    }

    const [selectedProducts, setSelectedProducts] = useState([]);
    const output = {}

    const onButtonSave = () => {
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
        output.products =selectedProducts.map(({productId}) => { return {productId} })
        if(!selectedId){
            dispatch(createDiscount(output))
        }else {dispatch(updateDiscount({discountId : selectedId?.discountId,output}))}
    }

    useEffect(() => {
        setSelectedProducts([]);
    }, [])
  return (
    <div className="flex max-h-[75vh] flex-col overflow-auto px-2">
        <Button
            isButton
            isPrimary
            className = {`${onEdit ? "hidden" : "lg:justify-self-start w-fit" }`}
            title = "Edit"
            onClick = {()=> setEdit(true)}
        />
        <div className=" flex gap-3">
            <Button
                isButton
                isDanger
                className = {`${!onEdit ? "hidden" : "lg:justify-self-start w-fit" }`}
                title = "Cancel"
                onClick = {onButtonCancel}
            />
            <Button
                isButton
                isPrimary
                className = {`${!onEdit ? "hidden" : "lg:justify-self-start w-fit" }`}
                title = "Save"
                onClick = {onButtonSave}
            />
        </div>

        <div className="flex items-center justify-between max-w-[80%] ">
            <div className="">
                <h3 className={`${onEdit ? "title mt-2" : "title mt-4" }`}>Name : </h3>
                <Input 
                    type = {`${!onEdit ? "hidden" : "text" }`}
                    ref = {nameRef}
                    placeholder = {selectedId?.discountName}
                />
                <h1 className={`${onEdit ? "hidden" : "title" }`}>| {selectedId?.discountName}</h1>

                <h3 className="title mt-4">Description : </h3>
                <Input 
                    type = {`${!onEdit ? "hidden" : "text" }`}
                    ref = {descRef}
                    placeholder = {selectedId?.discountDesc}
                />
                <h1 className={`${onEdit ? "hidden" : "title" }`}>| {selectedId?.discountDesc}</h1>

                <h3 className={`${onEdit ? "title mt-5" : "title mt-4" }`}>Is Percentage : </h3>
                <h1 className={`${onEdit ? "hidden" : "title" }`}>| {selectedId?.isPercentage ? "Yes" : "No" }</h1>
                <fieldset className={`${onEdit ? "pt-3" : "hidden"}`} id="percentage">
                    <div>
                        <input
                            type="radio"
                            id="1"
                            name="isPercentage"
                            value="yes"
                            checked = {isPercentage?.name === "yes" ? true : false}
                            onChange={()=>{setIsPercentage({id:"1",name:"yes"})}}
                            
                        />
                        <label for="1" className="mr-4">Yes</label>

                        <input 
                            type="radio" 
                            id="0" 
                            name="isPercentage" 
                            value="no" 
                            checked = {isPercentage?.name === "no" ? true : false}
                            onChange={()=>{setIsPercentage({id:"0",name:"no"})}}
                        />
                        <label for="0">No</label>
                    </div>
                </fieldset>

                <h3 className="title mt-4">Is One Get One : </h3>
                <h1 className={`${onEdit ? "hidden" : "title" }`}>| {selectedId?.oneGetOne ? "Yes" : "No" }</h1>
                <fieldset className={`${onEdit ? "pt-3" : "hidden"}`} id="oneGetOne">
                    <div>
                        <input
                            type="radio"
                            id="1"
                            name="isOneGetOne"
                            value="yes"
                            checked = {isOneGetOne?.name === "yes" ? true : false}
                            onChange={()=>{setIsOneGetOne({id:"1",name:"yes"})}}
                            
                        />
                        <label for="1" className="mr-4">Yes</label>

                        <input 
                            type="radio" 
                            id="0" 
                            name="isOneGetOne" 
                            value="no" 
                            checked = {isOneGetOne?.name === "no" ? true : false}
                            onChange={()=>{setIsOneGetOne({id:"0",name:"no"})}}
                        />
                        <label for="0">No</label>
                    </div>
                </fieldset>
            </div>
            <div className="">
                <h3 className="title mt-4">Code : </h3>
                <Input 
                    type = {`${!onEdit ? "hidden" : "text" }`}
                    ref = {codeRef}
                    placeholder = {selectedId?.discountCode ? selectedId?.discountCode : "-"}
                />
                <h1 className={`${onEdit ? "hidden" : "title" }`}>| {selectedId?.discountCode ? selectedId?.discountCode : "-"}</h1>

                <h3 className="title mt-4">Expired Date : </h3>
                <Input 
                    type = {`${!onEdit ? "hidden" : "text" }`}
                    ref = {expiredRef}
                    placeholder = {selectedId?.discountExpired ? Date(selectedId?.discountExpired) : "-"}
                />
                <h1 className={`${onEdit ? "hidden" : "title" }`}>| {selectedId?.discountExpired ? Date(selectedId?.discountExpired) : "-"}</h1>
               
                <h3 className="title mt-4">Amount : </h3>
                <Input 
                    type = {`${!onEdit ? "hidden" : "number" }`}
                    ref = {amountRef}
                    placeholder = {selectedId?.isPercentage ? `${selectedId.discountAmount}%` : `IDR ${formatNumber(selectedId?.discountAmount)}` }
                />
                <h1 className={`${onEdit ? "hidden" : "title" }`}>| {selectedId?.isPercentage ? `${selectedId?.discountAmount}%` : `IDR ${formatNumber(selectedId?.discountAmount)}` }</h1>

                <h3 className="title mt-4">Minimum Transaction : </h3>
                <Input 
                    type = {`${!onEdit ? "hidden" : "number" }`}
                    ref = {minimumRef}
                    placeholder = {!selectedId?.minimalTransaction ? "-" : `IDR ${formatNumber(selectedId?.discountAmount)}` }
                />
                <h1 className={`${onEdit ? "hidden" : "title" }`}>| {!selectedId?.minimalTransaction ? "-" : `IDR ${formatNumber(selectedId?.discountAmount)}` }</h1>
            </div>
        </div>
        <ProductList data={selectedId} onEdit={onEdit} selectedProducts={selectedProducts} setSelectedProducts={setSelectedProducts} products={products} />
        
    </div>
  )
}
