import React, { useRef, useState } from "react";
import Button from "../../../../components/Button";
import Input from "../../../../components/Input";
import { useDispatch } from "react-redux";
import { getUnits, updateUnit } from "../../../../store/slices/product/unit/slices";
import SuccessMessage from "../../../../components/Message";


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

    const [confirmation, setConfirmation] = useState(false);
    if (success) {
        return (
            <SuccessMessage
                type="success"
                message={`Change product unit from ${unitBefore} into ${ unitSelected.unitName } success`}
                handleCloseModal={handleCloseModal}
            />
        );
    }

    const dataUnits = units.filter((unit) => unit.isSecondary.toString() === unitSelected.isSecondary.toString())

    const handleChangeUnit = (event) => {
        setSelectedUnit({
            unitId :event.target.selectedOptions[0].className,
            unitName :event.target.selectedOptions[0].value,
            isSecondary : event.target.selectedOptions[0].id
        })
    }

    const handleChangeDefault = (type) => {
        setIsDefaultUnit(type)
    }

    const handleOnSure = ()=>{
        dispatch(
            updateUnit({
                data :{
                    unitId : unitSelected?.unitId ? unitSelected?.unitId : units.length + 1,
                    quantity : selectedUnit?.product_detail?.quantity,
                    convertion : qtyPerUnitRef?.current?.value ? qtyPerUnitRef?.current?.value : 0,
                    isDefault : isDefaultUnit.id,
                    stockId : selectedUnit?.product_detail?.stockId,
                    isSecondary : unitSelected?.isSecondary ? unitSelected?.isSecondary : selectedUnit.isSecondary,
                    unitName : unitRef?.current?.value ? unitRef?.current?.value : ""
                },
                productId : productData.productId
            })
        )
        dispatch(getUnits())
        setConfirmation(false)
    }

  return (
    <div className="max-h-[75vh] overflow-auto px-1">
       | {productData.productName}
       <form >
            <div className="mt-4 flex flex-col gap-y-4 ">
                <div className="h-auto max-h-[75vh] overflow-auto px-1">
                    <h3>Unit ({selectedUnit.name}): </h3>
                    {unitSelected.unitName === "other" ?
                        <Input
                            ref={unitRef}
                            placeholder="Input Unit Name"
                        />
                        :
                        <select 
                            value={unitSelected?.unitName} 
                            onChange={handleChangeUnit}
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        >
                            <option >Choose an unit </option>
                            {dataUnits.map((unit) => (
                                <option selected={unitSelected.unitId === unit.unitId} className={unit.unitId.toString()} value={unit.name} id={unit.isSecondary.toString()}>{unit.name}</option>
                            ))}
                            <option value="other">Input Manual </option>
                        </select>

                    }
{/*                     
                    <fieldset className="mt-4 hidden">
                        <legend>Is Default Unit?</legend>
                        <div>
                            <input
                                type="radio"
                                id="1"
                                name="isDefault"
                                value="yes"
                                checked = {isDefaultUnit.name === "yes" ? true : false}
                                onChange={()=>{handleChangeDefault({id:"1",name:"yes"})}}
                                
                            />
                            <label for="1" className="mr-4">Yes</label>
                            <input 
                                type="radio" 
                                id="0" 
                                name="isDefault" 
                                value="no" 
                                checked = {isDefaultUnit.name === "no" ? true : false}
                                onChange={()=>{handleChangeDefault({id:"0",name:"no"})}}
                            />
                            <label for="0">No</label>
                        </div>
                    </fieldset> */}

                    { isDefaultUnit.name === "yes" ?
                        <div>
                            <h3 className="pt-2">Qty per Unit : </h3>
                            <input
                                type="number"
                                ref={qtyPerUnitRef}
                                id="qtyUnit"
                                name="qtyPerUnit"
                                defaultValue={selectedUnit?.product_detail?.convertion}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            />
                        </div>
                        :""
                    }
                </div>
            </div>
            <div className={`mt-4 flex gap-2 ${confirmation ? "hidden":""}`}>
                <Button 
                    title="Back" 
                    isButton 
                    isSecondary 
                    onClick={() =>
                        handleShowModal({
                            context : "Edit Unit",
                            productId : productData.productId,
                            unitId : ""
                        })
                    }
                />
                <Button
                    isButton
                    isPrimary
                    title="Confirm"
                    onClick={()=>{setConfirmation(true)}}
                />
            </div>

            {confirmation && (
                <div className="pt-10">
                    <p className="modal-text">
                        Are you sure you want to save these changes?
                    </p>
                    <div className="flex gap-2">
                        <Button
                            title="Cancel" 
                            isButton 
                            isSecondary 
                            onClick={() => setConfirmation(false)}
                        />

                        <Button
                            title="Sure"
                            isButton
                            isPrimary
                            onClick={handleOnSure}
                        >
                            Sure
                        </Button>
                    </div>
                </div>
            )}
        </form>
    </div>
  );
}
