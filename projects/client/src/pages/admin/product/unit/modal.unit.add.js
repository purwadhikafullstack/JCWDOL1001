import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from 'react-toastify'
import Button from "../../../../components/Button";
import Input from "../../../../components/Input";
import SuccessMessage from "../../../../components/Message";
import { addUnit } from "../../../../store/slices/product/unit/slices";
import { ProductUnitValidationSchema } from "../../../../store/slices/product/unit/validation";

export default function ModalAddProductUnit({
  success,
  units,
  productData,
  handleShowModal,
  handleCloseModal,
}) {
    const dispatch = useDispatch()
    const unitRef = useRef()
    const qtyRef = useRef()
    const qtyPerUnitRef = useRef()

    const [confirmation, setConfirmation] = useState(false);

    const canAddDefaultUnit = productData.productUnits.filter(
        (unit) => unit.product_detail.isDefault && !unit.product_detail.isDeleted
    ).length < 1

    const canAddSecondaryUnit = productData.productUnits.filter(
        (unit) => !unit.product_detail.isDefault && !unit.product_detail.isDeleted
    ).length < 1

    const defaultUnitName = productData.productUnits.filter(
        (unit) => unit.product_detail.isDefault && !unit.product_detail.isDeleted
    )
    
    let dataUnits = []

    if(canAddSecondaryUnit && !canAddDefaultUnit){
        dataUnits = units.filter((unit) => unit.isSecondary === 1 && unit.name.toLowerCase() !== defaultUnitName[0]?.name.toLowerCase() )
    }else {
        dataUnits = units.filter((unit)=> unit.isSecondary === 0)
    }
    
    const [unitSelected, setSelectedUnit] = useState({
        unitId : dataUnits[0].unitId,
        unitName : dataUnits[0].unitName
    });

    const [isDefaultUnit, setIsDefaultUnit] = useState({
        id : canAddDefaultUnit ? 1 : 0,
        name :canAddDefaultUnit ? "Ya":"Tidak"
    })

    const handleChangeUnit = (event) => {
        setSelectedUnit({
            unitId :event.target.selectedOptions[0].className,
            unitName :event.target.selectedOptions[0].value
        })
        setError({ ...error, unit: false })
    }

    const handleChangeDefault = (type) => {
        setIsDefaultUnit({
            id : type.id,
            name : type.name
        })
    }

    const [error, setError] = useState("")
    const [isToastVisible, setIsToastVisible] = useState(false)

    const output = {data:{},productId:""}

    const handleOnSure = async ()=> {
        qtyRef?.current?.value ? output.data.quantity = qtyRef?.current?.value : output.data.quantity = 0
        
        qtyPerUnitRef?.current?.value ? output.data.convertion = qtyPerUnitRef?.current?.value : output.data.convertion = 0
       
        if( unitRef?.current?.value ){
            output.data.unitName = unitRef?.current?.value
        }
        
        output.data.unitId = unitRef?.current?.value ? units.length + 1 : unitSelected.unitId
        
        output.data.isDefault= canAddDefaultUnit && canAddSecondaryUnit ? isDefaultUnit.id : canAddSecondaryUnit ? 0 : 1
        
        output.data.isSecondary = output.data.isDefault == 1 ? 0 : 1
        
        output.productId = productData.productId
        
        try {
            if((output.data.isDefault == 1 && (output.data.quantity === 0 || output.data.convertion === 0))&& unitSelected.unitName==="default"){
                throw({
                    inner : 
                    [{
                        path : "quantity",
                        message:"Satuan utama harus memiliki kuantitas"
                    },{
                        path : "convertion",
                        message:"Satuan utama harus memiliki kuantitas per satuan"
                    },{
                        path : "unit",
                        message:"Satuan harus dipilih"
                    }]
                })
            }
            
            if(output.data.isDefault == 1 && output.data.quantity === 0) {
                throw({inner: [{
                    path : "quantity",
                    message:"Satuan utama harus memiliki kuantitas"
                }]})
            }
    
            if(output.data.isDefault == 1 && output.data.convertion === 0) {
                throw({inner: [{
                    path : "convertion",
                    message:"Satuan Utama harus memiliki kuantitas per satuan"
                }]})
            }
    
            if(unitSelected.unitName==="default") {
                throw({inner: [{
                    path : "unit",
                    message:"Satuan belum dipilih"
                }]})
            }

            if((unitRef?.current?.value.toLowerCase()===defaultUnitName[0]?.name.toLowerCase()) && (unitRef?.current?.value !== undefined && defaultUnitName[0]?.name !== undefined)) {
                throw({inner: [{
                    path : "unit",
                    message:"Nama satuan tidak boleh sama dengan satuan yang aktif"
                }]})
            }
            dispatch(addUnit(output))

            setConfirmation(false)
            
        }catch (error) {
            const errors = {}
            
            error.inner?.forEach((innerError) => {
                errors[innerError.path] = innerError.message;
            })
            
            setError(errors)
            
            toast.error("Periksa kolom pengisian!")

            setConfirmation(false)

            setIsToastVisible(true)

            setTimeout(() => {
                setIsToastVisible(false)
            }, 2000)
        }
    }

    if (success) {
        return (
            <SuccessMessage
                type="success"
                message={`Berhasil menambahkan satuan ke ${productData.productName}!`}
                handleCloseModal={handleCloseModal}
            />
        );
    }

  return (
    <div className="max-h-[75vh] overflow-auto px-1">
       | {productData.productName}
       <form >
            <div className="mt-4 flex flex-col gap-y-4">
                <div className="h-auto max-h-[75vh] overflow-auto px-1">
                    <h3>Satuan : </h3>
                    <Button onClick={()=>{
                        setSelectedUnit({
                            unitName :"default"
                        })
                    }} className={`${unitSelected.unitName === "other" ? "text-red-600" : "hidden"}`}>Pilihan Satuan</Button>
                    {unitSelected.unitName === "other" ?
                        <Input
                            ref={unitRef}
                            placeholder="Masukkan Nama Satuan"
                        />
                        :
                        <select 
                            value={unitSelected?.unitName} 
                            onChange={handleChangeUnit}
                            className={`bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 ${error.unit ? `border-red-500` : `border-gray-300` }`}
                        >
                            <option value="default" disabled >Pilih Satuan</option>
                            {dataUnits.map((unit) => (
                                <option selected={unitSelected.unitId === unit.unitId} className={unit.unitId.toString()} value={unit.name}>{unit.name}</option>
                            ))}
                            <option value="other">Input Manual</option>
                        </select>

                    }                           
                    {error.unit && (
                        <div className="text-sm text-red-500 dark:text-red-400">
                            {error.unit}
                        </div>
                    )}

                    { (canAddDefaultUnit && canAddSecondaryUnit && isDefaultUnit.name === "Ya") || (canAddDefaultUnit && !canAddSecondaryUnit) ?
                        <div>
                            <h3 className="pt-2">Jumlah Satuan : </h3>
                            <Input
                                type="number"
                                ref={qtyRef}
                                id="qty"
                                name="qtyUnit"
                                errorInput={error.quantity}
                                onChange={()=>{setError({ ...error, quantity: false })}}
                            />                            
                            {error.quantity && (
                                <div className="text-sm text-red-500 dark:text-red-400">
                                    {error.quantity}
                                </div>
                            )}
                            <h3 className="pt-2">Jumlah per Satuan : </h3>
                            <Input
                                type="number"
                                ref={qtyPerUnitRef}
                                id="qtyUnit"
                                name="qtyPerUnit"
                                errorInput={error.convertion}
                                onChange={()=>{setError({ ...error, convertion: false })}}
                            />                            
                            {error.convertion && (
                                <div className="text-sm text-red-500 dark:text-red-400">
                                    {error.convertion}
                                </div>
                            )}
                        </div>
                        :""
                    }
                </div>
            </div>
            <div className={`${confirmation ? "hidden" : "mt-4 flex gap-2"}`}>
                <Button 
                    title="Kembali" 
                    isButton 
                    isSecondary 
                    onClick={() =>
                        handleShowModal({
                            context : "Ubah Satuan",
                            productId : "",
                            unitId : ""
                        })
                    }
                />
                <Button
                    isButton
                    isPrimary
                    title="Konfirmasi"
                    onClick={()=>{setConfirmation(true)}}
                />
            </div>

            {confirmation && (
                <div className="pt-10">
                    <p className="modal-text">
                        Apa kamu yakin untuk menyimpan perubahan ini?
                    </p>
                    <div className="flex gap-2">
                        <Button
                            title="Tidak" 
                            isButton 
                            isSecondary 
                            onClick={() => setConfirmation(false)}
                        />

                        <Button
                            title="Ya"
                            isButton
                            isPrimary
                            onClick={handleOnSure}
                        />
                    </div>
                </div>
            )}
        </form>

    </div>
  );
}
