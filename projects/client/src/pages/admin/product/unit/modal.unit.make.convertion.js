import React, { useRef, useState } from "react";
import Button from "../../../../components/Button";
import { useDispatch } from "react-redux";
import SuccessMessage from "../../../../components/Message";
import { convertUnit } from "../../../../store/slices/product/unit/slices";

export default function ModalMakeConvertion({
  success,
  productData,
  handleShowModal,
  handleCloseModal,
}) {
    console.log(productData)
    const dispatch = useDispatch()
    const timesRef = useRef()

    const [confirmation, setConfirmation] = useState(false);

    if (success) {
        return (
            <SuccessMessage
                type="success"
                message={`Convert product unit of ${productData.productName} success`}
                handleCloseModal={handleCloseModal}
            />
        );
    }

    const handleOnSure = async ({times, productId})=> {
        dispatch(convertUnit({times,productId}))
    }

  return (
    <div className="max-h-[75vh] overflow-auto px-1">
       | {productData.productName}
       <form >
            <div className="mt-4 flex flex-col gap-y-4">
                <div className="h-auto max-h-[75vh] overflow-auto px-1">
                    <h3 className="pt-2">How many time(s) of convertion that you need? : </h3>
                        <input
                            type="number"
                            ref={timesRef}
                            id="qty"
                            name="qtyUnit"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                </div>
            </div>
            <div className="mt-4 flex gap-2">
                <Button 
                    title="Back" 
                    isButton 
                    isSecondary 
                    onClick={() => 
                        handleShowModal({
                            context:"Edit Unit",
                            productId : productData.productId
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
                        Are you sure you want to make this convertion?
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
                            onClick={() => 
                                handleOnSure({
                                    times : timesRef?.current?.value ,
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
