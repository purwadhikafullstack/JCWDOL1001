import React, { useRef, useState } from "react";
import Button from "../../../../components/Button";
import Input from "../../../../components/Input";
import { useDispatch } from "react-redux";
import { getUnits, updateUnit } from "../../../../store/slices/product/unit/slices";
import SuccessMessage from "../../../../components/Message";
import { toast } from "react-toastify";
import { ProductUnitValidationSchema } from "../../../../store/slices/product/unit/validation";


export default function ModalEditProductUnit({
  success,
  units,
  productData,
  selectedUnit,
  handleShowModal,
  handleCloseModal,
}) {
    const dispatch = useDispatch()
    const unitRef = useRef()
    const qtyPerUnitRef = useRef()

    const [unitSelected, setSelectedUnit] = useState({
        unitId : selectedUnit?.unitId,
        unitName : selectedUnit?.name,
        isSecondary : selectedUnit?.isSecondary
    });

    const unitBefore = selectedUnit.name

    const [isDefaultUnit, setIsDefaultUnit] = useState({
        id : `${selectedUnit?.product_detail?.isDefault === true ? 1: 0 }`,
        name : `${selectedUnit?.product_detail?.isDefault === true ? "yes": "no" }`
    })

    const [confirmation, setConfirmation] = useState(false)

    const dataUnits = units.filter((unit) => unit.isSecondary?.toString() === unitSelected.isSecondary?.toString())

    const handleChangeUnit = (event) => {
        setSelectedUnit({
            unitId :event.target.selectedOptions[0].className,
            unitName :event.target.selectedOptions[0].value,
            isSecondary : event.target.selectedOptions[0].id
        })
        setError({ ...error, unit: false })
    }

    const [error, setError] = useState("")
    const [isToastVisible, setIsToastVisible] = useState(false)
    const output = {}
    const handleOnSure = async ()=>{
        try{
            output.data ={
                unitId : unitSelected?.unitId ? unitSelected?.unitId : units.length + 1,
                quantity : selectedUnit?.product_detail?.quantity,
                convertion : qtyPerUnitRef?.current?.value ? +qtyPerUnitRef?.current?.value : selectedUnit.product_detail.convertion,
                isDefault : +isDefaultUnit.id,
                stockId : selectedUnit?.product_detail?.stockId,
                isSecondary : unitSelected?.isSecondary ? unitSelected?.isSecondary : selectedUnit.isSecondary,
                unitName : unitRef?.current?.value ? unitRef?.current?.value : ""
            }
            
            if(output.data.isSecondary === 0 && output.data.convertion === 0 && output.data.isDefault ===1 ){
                throw({inner: [{
                    path : "convertion",
                    message:"Satuan utama harus memiliki kuantitas per satuan"
                }]})
            }

            if(output.data.isSecondary !== 0  && unitBefore === unitSelected.unitName ){
                throw({inner: [{
                    path : "unit",
                    message:"Satuan tidak mengalami perubahan"
                }]})
            }
            await ProductUnitValidationSchema.validate(output.data,{
                abortEarly:false
            })

            dispatch(
                updateUnit({
                    data :output.data,
                    productId : productData.productId
                })
            )
            dispatch(getUnits())
            setConfirmation(false)
        } catch(error){
            const errors = {}
            
            error.inner.forEach((innerError) => {
                errors[innerError.path] = innerError.message;
            })
            
            setError(errors)
            
            toast.error("Check your input field!")

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
                message={`${selectedUnit?.product_detail?.isDefault ? `Perubahan satuan  ${unitBefore} berhasil` : `Penggantian satuan berhasil`}`}
                handleCloseModal={handleCloseModal}
            />
        );
    }

    return (
    <div className="max-h-[75vh] overflow-auto px-1">
       | {productData.productName}
       <form >
            <div className="mt-4 flex flex-col gap-y-4 ">
                <div className="h-auto max-h-[75vh] overflow-auto px-1">
                    <h3>Satuan ({selectedUnit.name}): </h3>
                    <Button onClick={()=>{
                        setSelectedUnit({
                            unitId : selectedUnit?.unitId,
                            unitName : selectedUnit?.name,
                            isSecondary : selectedUnit?.isSecondary
                        })
                    }} className={`${unitSelected.unitName === "other" ? "text-red-600" : "hidden"}`}>Reset Satuan</Button>
                    {unitSelected.unitName === "other" ?
                        <Input
                            ref={unitRef}
                            placeholder="Masukkan nama satuan"
                        />
                        :
                        <select 
                            value={unitSelected?.unitName} 
                            onChange={handleChangeUnit}
                            className={`bg-gray-50 border  text-gray-900 text-sm rounded-lg block w-full p-2.5 ${error.unit ? `border-red-600` : `border-gray-300`}`}
                        >
                            <option value="default" >Pilih satuan </option>
                            {dataUnits.map((unit) => (
                                <option selected={unitSelected.unitId === unit.unitId} className={unit.unitId.toString()} value={unit.name} id={unit.isSecondary.toString()}>{unit.name}</option>
                            ))}
                            <option value="other">Input Manual </option>
                        </select>

                    }
                    {error.unit && (
                        <div className="text-sm text-red-500 dark:text-red-400">
                            {error.unit}
                        </div>
                    )}

                    { isDefaultUnit.name === "yes" ?
                        <div>
                            <h3 className="pt-2">Kuantitas per Satuan : </h3>
                            <Input
                                type="number"
                                ref={qtyPerUnitRef}
                                id="qtyUnit"
                                name="qtyPerUnit"
                                errorInput={error.convertion}
                                defaultValue={selectedUnit.product_detail.convertion}
                                placeholder={selectedUnit.product_detail.convertion}
                                onChange={() => setError({ ...error, convertion: false })}
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
            <div className={`mt-4 flex gap-2 ${confirmation ? "hidden":""}`}>
                <Button 
                    title="Kembali" 
                    isButton 
                    isSecondary 
                    onClick={() =>
                        handleShowModal({
                            context : "Ubah Satuan",
                            productId : productData.productId,
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
                        Apakah kamu yakin ingin menyimpan perubahan ini?
                    </p>
                    <div className="flex gap-2">
                        <Button
                            title="Tidak" 
                            isButton 
                            isSecondary 
                            onClick={() => setConfirmation(false)}
                        />

                        <Button
                            title="Yakin"
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
