import React, { useRef, useState } from "react";
import Button from "../../../../components/Button";
import { useDispatch } from "react-redux";
import SuccessMessage from "../../../../components/Message";
import { convertUnit } from "../../../../store/slices/product/unit/slices";
import Input from "../../../../components/Input";

export default function ModalMakeConvertion({
  success,
  productData,
  handleShowModal,
  handleCloseModal,
}) {
    const dispatch = useDispatch()
    
    const [timesValue,setTimesValue] = useState(1)

    const [confirmation, setConfirmation] = useState(false);

    if (success) {
        return (
            <SuccessMessage
                type="success"
                message={`Konversi ${productData.productName} ke satuan unit terkecil berhasil`}
                handleCloseModal={handleCloseModal}
            />
        );
    }

    const handleOnSure = async ({times, productId})=> {
        dispatch(convertUnit({times,productId}))
    }
    
    const qtyUnit = productData.product_details.filter((unit)=> unit.isDefault === true)[0].quantity
    
    const onChangeTimes = (e)=>{
        e.preventDefault()
        e.target.value > qtyUnit ? setTimesValue(qtyUnit) : e.target.value <= 0 ? setTimesValue(1) : setTimesValue(e.target.value)
    }

  return (
    <div className="max-h-[75vh] overflow-auto px-1">
        <div className="flex flex-col">
            <a>| {productData.productName} </a>
            <a>| Qty : {qtyUnit}</a>
            <a>| Per unit : {productData.product_details.filter((unit)=> unit.isDefault === true)[0].convertion} </a>
        </div>
       <form >
            <div className="mt-4 flex flex-col gap-y-4">
                <div className="h-auto max-h-[75vh] overflow-auto px-1">
                    <h3 className="pt-2">Berapa kali konversi yang kamu butuhkan? :</h3>
                        <Input
                            type="numberSecondVariant"
                            onChange={onChangeTimes}
                            value = {timesValue}
                            id="qty"
                            name="qtyUnit"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                </div>
            </div>
            <div className={`${confirmation ? "hidden" : "mt-4 flex gap-2"}`}>
                <Button 
                    title="Kembali" 
                    isButton 
                    isSecondary 
                    onClick={() => 
                        handleShowModal({
                            context:"Ubah Satuan",
                            productId : productData.productId
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
                        Apakah kamu yakin ingin melakukan konversi ini?
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
                            onClick={() => 
                                handleOnSure({
                                    times : timesValue ,
                                    productId : productData.productId
                                })
                            }
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
