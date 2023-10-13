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
  const [valueTypeState, setValueTypeState] = useState("tambah")

  const [error, setError] = useState("");
  const [confirmAdd, setConfirmAdd] = useState(false);

  const [inputFormData, setInputFormData] = useState(null)
  const [file, setFile] = useState(null);
  const [dataImage, setDataImage] = useState(null);
  const [quantity, setQuantity] = useState(1)


  const valueChange = (e) => {
    e.preventDefault();
    if(valueType?.current?.value === "tambah"){
      setValueTypeState("tambah")
    }
    if(valueType?.current?.value === "hapus"){
      setValueTypeState("hapus")
      if(quantity >= productData?.product_details[0]?.quantity){
        setQuantity(productData?.product_details[0]?.quantity)
      }
    }
  }

const plusButton = (e) => {
  e.preventDefault();
  setQuantity(quantity + 1)
  if(quantity >= productData?.product_details[0]?.quantity && valueTypeState === "hapus"){
    setQuantity(productData?.product_details[0]?.quantity)
  }
}

const minusButton = (e) => {
  e.preventDefault();
  if(quantity > 1){
    setQuantity(quantity - 1)
  }
}

const inputStockChange = (e) => {
  e.preventDefault();
  let newValue = parseInt(e.target.value);
    if (!isNaN(newValue)) {
      if(newValue >= productData?.product_details[0]?.quantity && valueTypeState === "hapus" ) {
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
    if(valueTypeState === "hapus"){
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
        message={"Stock produk berhasil diubah"}
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
      onSubmit={event=>handleSubmit(event)}
      
      >
        <div className={`${confirmAdd ? "hidden" : null}`}>
 

          <div className="my-4 flex flex-col gap-y-4">
            {/* <div className="font-semibold">
              <Input
                type="text"
                label="Product Name"
                placeholder={productData?.productName}
                isDisabled = {true}
              />
            </div> */}
            <div className="flex flex-col lg:flex-row gap-2">
              {`Nama produk : `}<div className="text-primary">{productData?.productName}</div>
            </div>
            <div className="flex flex-col lg:flex-row gap-2">
            {"Stok saat ini : "} <div className="text-primary">
                {productData?.product_details[0]?.quantity}</div>
            </div>
          </div>
          
          {/* <div className="mt-4 flex flex-col gap-y-4">
            <div className="font-semibold">
              <Input
                type="text"
                label="Current Stock(s)"
                placeholder={productData?.product_details[0]?.quantity}
                isDisabled = {true}
              />
            </div>
          </div> */}

          <div className="flex flex-col my-3 border-t pt-6">
          {/* <div className="font-bold text-lg text-teal-600">
          Perubahan Stok
          </div> */}
          <span className="text-xs">
            Silahkan pilih, apakah ingin menambah / mengurangi stok saat ini?
            </span>
          </div>
          <div>
          <select className="rounded-lg border bg-inherit px-2 pb-2 mb-6 outline-none focus:ring-2 " 
          ref={valueType} onChange={valueChange}
                >
                    <option value="tambah" 
                    >
                    Tambah Stok</option>
                    <option value="hapus"
                    >
                    Hapus Stok</option>
          </select>
          </div>
          <span className="text-xs my-10">
            Berapa banyak unit(pcs) yang mau di{valueTypeState || ""}?
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
                  value={(quantity >= productData?.product_details[0]?.quantity && valueTypeState === "hapus")
                   ? productData?.product_details[0]?.quantity : 
                   quantity < 1 ? 1 : quantity }
                  onChange={event =>{inputStockChange(event)
                    setError({ ...error, value: false })
                  }}
                  errorInput={error.value}
                />
                {error.value && (
                <div className="text-sm text-red-500 dark:text-red-400">
                  {error.value}
                </div>
              )}
          <button     
            className="p-2  duration-300 border-2
             rounded-lg border-gray-600 hover:text-white hover:bg-primary hover:border-primary
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
              ${valueTypeState === "tambah" ? "bg-primary" : "bg-red-700"}
              px-6 
              py-2 
              text-sm 
              text-white 
              duration-300 
              ${valueTypeState === "tambah" ? "hover:bg-primary" : "hover:bg-red-500"}`}
              type="submit"
            >
              {valueTypeState === "tambah" ? "Tambah" : "Hapus" }
            </button>
          </div>
        </div>

        {confirmAdd && (
          <div className={``}>
  
              <p className="modal-text">
              Apakah kamu yakin ingin {valueTypeState} stok untuk produk ini?
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
