import React, { useRef, useState } from "react";
import Button from "../../../../components/Button";
import Input from "../../../../components/Input";
import { useDispatch } from "react-redux";
import SuccessMessage from "../../../../components/Message";
import { addUnit } from "../../../../store/slices/product/unit/slices";

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

    const [unitSelected, setSelectedUnit] = useState({
        unitId : "",
        unitName : ""
    });

    const [isDefaultUnit, setIsDefaultUnit] = useState({
        id : 0,
        name :"no"
    })

    const [confirmation, setConfirmation] = useState(false);

    const canAddDefaultUnit = productData.productUnits.filter(
        (unit) => unit.product_detail.isDefault.toString() === "true"
    ).length < 1

    const canAddSecondaryUnit = productData.productUnits.filter(
        (unit) => unit.product_detail.isDefault.toString() === "false" && unit.product_detail.isDeleted.toString() === "false"
    ).length < 1

    let dataUnits = []
    
    if(canAddDefaultUnit && canAddSecondaryUnit ){
        dataUnits = units
    }else if(canAddSecondaryUnit){
        dataUnits = units.filter((unit) => unit.isSecondary.toString() === canAddSecondaryUnit.toString())
    }else{
        dataUnits = units.filter((unit) => unit.isSecondary.toString() === (!canAddDefaultUnit).toString())
    }


    if (success) {
        return (
            <SuccessMessage
                type="success"
                message={`Add product unit ${unitSelected.unitName} into ${productData.productName} success`}
                handleCloseModal={handleCloseModal}
            />
        );
    }

    const handleChangeUnit = (event) => {
        setSelectedUnit({
            unitId :event.target.selectedOptions[0].className,
            unitName :event.target.selectedOptions[0].value
        })
    }

    const handleChangeDefault = (type) => {
        setIsDefaultUnit(type)
    }

    const output = {data:{},productId:""}

    const handleOnSure = async ()=> {
        qtyRef?.current?.value ? output.data.quantity = qtyRef?.current?.value : output.data.quantity = 0
        
        qtyPerUnitRef?.current?.value ? output.data.convertion = qtyPerUnitRef?.current?.value : output.data.convertion = 0
       
        if( unitRef?.current?.value ){
            output.data.unitName = unitRef?.current?.value
        }

        output.data.unitId = unitRef?.current?.value ? units.length + 1 : unitSelected.unitId

        output.data.isDefault= canAddDefaultUnit && canAddSecondaryUnit ? isDefaultUnit.id : canAddSecondaryUnit ? 0 : 1

        output.productId = productData.productId
        
        try {

            if(output.data.isDefault == 1 && output.data.quantity === 0) throw(
                alert("Default Unit must have qty")
            )
    
            if(output.data.isDefault == 1 && output.data.convertion === 0) throw(
                alert("Default Unit must have qty per unit")
            )
            dispatch(addUnit(output))

            setConfirmation(false)
            
        }catch (error) {}
    }

  return (
    <div className="max-h-[75vh] overflow-auto px-1">
       | {productData.productName}
       <form >
            <div className="mt-4 flex flex-col gap-y-4">
                <div className="h-auto max-h-[75vh] overflow-auto px-1">
                    <h3>Unit : </h3>
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
                                <option selected={unitSelected.unitId === unit.unitId} className={unit.unitId.toString()} value={unit.name}>{unit.name}</option>
                            ))}
                            <option value="other">Manual Input </option>
                        </select>

                    }
                    
                    <fieldset className={`${canAddDefaultUnit && canAddSecondaryUnit ? "mt-4" : "hidden"}`}>
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
                    </fieldset>

                    { (canAddDefaultUnit && canAddSecondaryUnit && isDefaultUnit.name === "yes") || (canAddDefaultUnit && !canAddSecondaryUnit) ?
                        <div>
                            <h3 className="pt-2">Qty Unit : </h3>
                            <Input
                                type="number"
                                ref={qtyRef}
                                id="qty"
                                name="qtyUnit"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            />
                            <h3 className="pt-2">Qty per Unit : </h3>
                            <Input
                                type="number"
                                ref={qtyPerUnitRef}
                                id="qtyUnit"
                                name="qtyPerUnit"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            />
                        </div>
                        :""
                    }
                </div>
            </div>
            <div className={`${confirmation ? "hidden" : "mt-4 flex gap-2"}`}>
                <Button 
                    title="Back" 
                    isButton 
                    isSecondary 
                    onClick={() =>
                        handleShowModal({
                            context : "Edit Unit",
                            productId : "",
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
