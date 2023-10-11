import React, { useEffect, useRef, useState } from "react";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import InputImage from "../../../components/InputImage";
import { useDispatch, useSelector } from "react-redux";
import { getCategory } from "../../../store/slices/cat/slices";
import { motion, AnimatePresence } from "framer-motion";
import { HiXMark } from "react-icons/hi2";
import {FaMinus,FaPlus} from "react-icons/fa"
import { capitalizeEachWords } from "../../../utils/capitalizeEachWords";
import {
  updateMainStock,
} from "../../../store/slices/product/slices";
import {
  updateMainStockValidationSchema
} from "../../../store/slices/product/validation";
import LoadingSpinner from "../../../components/LoadingSpinner";
import Message from "../../../components/Message";


export default function ModalEditStock({
  success,
  productData,
  handleCloseModal,
  isSubmitStockLoading,
  errorMessage,
}) {
  const dispatch = useDispatch();

  const productNameRef = useRef(null);
  const valueType = useRef(null);
  const [valueTypeState, setValueTypeState] = useState("Add")

  const [error, setError] = useState("");
  const [confirmAdd, setConfirmAdd] = useState(false);

  const [inputFormData, setInputFormData] = useState(null)
  const [file, setFile] = useState(null);
  const [dataImage, setDataImage] = useState(null);
  const [quantity, setQuantity] = useState(0)


  const valueChange = (e) => {
    e.preventDefault();
    if(valueType?.current?.value === "Add"){
      setValueTypeState("Add")
    }
    if(valueType?.current?.value === "Remove"){
      setValueTypeState("Remove")
      if(quantity >= productData?.product_details[0]?.quantity){
        setQuantity(productData?.product_details[0]?.quantity)
      }
    }
  }

const plusButton = (e) => {
  e.preventDefault();
  setQuantity(quantity + 1)
  if(quantity >= productData?.product_details[0]?.quantity && valueTypeState === "Remove"){
    setQuantity(productData?.product_details[0]?.quantity)
  }
}

const minusButton = (e) => {
  e.preventDefault();
  if(quantity > 0){
    setQuantity(quantity - 1)
  }
}

const inputStockChange = (e) => {
  e.preventDefault();
  let newValue = parseInt(e.target.value);
    if (!isNaN(newValue)) {
      if(newValue >= productData?.product_details[0]?.quantity && valueTypeState === "Remove" ) {
        newValue = productData?.product_details[0]?.quantity
      }
      setQuantity(newValue);
    }
}
  const handleSubmit = async (event) => {
    event.preventDefault();
    //nilai value dan productId
     let value = quantity;
     const productId = productData.productId;
    if(valueTypeState === "Remove"){
        value = -1 * quantity
    }
    const request = {
      value : value,
      productId : productId
    }
    try {
        await updateMainStockValidationSchema.validate(request, {
          abortEarly: false,
        });
        setError("");
        setConfirmAdd(true);
        if (confirmAdd) {
          dispatch(updateMainStock(request));
        }
      
    } catch (error) {
      const errors = {};

      error.inner.forEach((innerError) => {
        errors[innerError.path] = innerError.message;
      });
      setError(errors);
    }
  };

  if (isSubmitStockLoading) {
    return <LoadingSpinner isLarge />;
  }

  if (success) {
    return (
      <Message
        type="success"
        message={"Stock Updated Successfully"}
        handleCloseModal={handleCloseModal}
      />
    );
  }

  if (errorMessage) {
    return (
      <Message
        type="error"
        message={errorMessage}
        handleCloseModal={handleCloseModal}
      />
    );
  }
 
  return (
    <div className="max-h-[75vh] overflow-auto px-1">
      <form 
      onSubmit={handleSubmit}
      
      >
        <div className={`${confirmAdd ? "hidden" : null}`}>
 

          <div className="mt-4 flex flex-col gap-y-4">
            <div className="font-semibold">
              <Input
                type="text"
                label="Product Name"
                placeholder={productData?.productName}
                isDisabled = {true}
              />
            </div>
          </div>
          
          <div className="mt-4 flex flex-col gap-y-4">
            <div className="font-semibold">
              <Input
                type="text"
                label="Current Stock(s)"
                placeholder={productData?.product_details[0]?.quantity}
                isDisabled = {true}
              />
            </div>
          </div>

          <div className="flex flex-col my-5">
          <div className="font-bold text-lg text-teal-600">
          Update Section
          </div>
          <span className="text-xs">
            Please choose whether to add / reduce current stock(s).
            </span>
          </div>
          <div>
          <select className="rounded-lg border bg-inherit px-2 py-2 mb-6 outline-none focus:ring-2 " 
          ref={valueType} onChange={valueChange}
                >
                    <option value="Add" 
                    >
                    Add Stocks</option>
                    <option value="Remove"
                    >
                      Remove Stocks</option>
          </select>
          </div>
          <span className="text-xs my-10">
            How many unit you would like to {valueTypeState.toLowerCase() || ""}?
            </span>

          
          <div className="flex flex-row gap-3 items-center mt-3 ">
            <button     
            className="p-2  duration-300 border-2
             rounded-lg border-gray-600 hover:text-white
             text-gray-600 text-lg hover:bg-red-700 hover:border-red-700"
            onClick={minusButton}
            >
              <FaMinus/>
            </button>
            <Input
                  type="numberSecondVariant"
                  value={(quantity >= productData?.product_details[0]?.quantity && valueTypeState === "Remove")
                   ? productData?.product_details[0]?.quantity : 
                   quantity < 0 ? 0 : quantity }
                  onChange={inputStockChange}
                  errorInput={error.value}
                />
                {error.value && (
                <div className="text-sm text-red-500 dark:text-red-400">
                  {error.value}
                </div>
              )}
          <button     
            className="p-2  duration-300 border-2
             rounded-lg border-gray-600 hover:text-white hover:bg-green-500 hover:border-green-500
             text-gray-600 text-lg"
            onClick={plusButton}
            >
              <FaPlus/>
            </button>
          </div>

          <div className="mt-8 flex gap-2">
            <Button
              isButton
              isBLock
              isSecondary
              title="Cancel"
              onClick={handleCloseModal}
            />
            <button
              className={`w-full 
              select-none 
              rounded-lg 
              ${valueTypeState === "Add" ? "bg-green-700" : "bg-red-700"}
              px-6 
              py-2 
              text-sm 
              text-white 
              duration-300 
              ${valueTypeState === "Add" ? "hover:bg-green-500" : "hover:bg-red-500"}`}
              type="submit"
            >
              {valueTypeState === "Add" ? "Add" : "Remove" }
            </button>
          </div>
        </div>

        {confirmAdd && (
          <div className={``}>
  
              <p className="modal-text">
                Are you sure you want to {valueTypeState.toLowerCase()} stock(s)
                 {valueTypeState === "Add" ? " to" : " from"} this product?
              </p>
          

            <div className="flex justify-end gap-2">
              {!isSubmitStockLoading && (
                <Button
                  isButton
                  isPrimaryOutline
                  title="Back"
                  className="mt-4"
                  type="button"
                  onClick={() => setConfirmAdd(false)}
                />
              )}

              <button
                className="mt-4
                select-none rounded-lg
                bg-primary
                px-6 py-2
                text-sm
                text-white
                duration-300
                hover:bg-teal-700"
                type="submit"
              >
                Sure
              </button>
            </div>
          </div>
        )}
      </form>

      
    </div>
  );
}
