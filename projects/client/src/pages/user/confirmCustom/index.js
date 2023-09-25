import React, { useEffect } from "react";
import Button from "../../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { setOrder } from "../../../store/slices/custom/slices";

export default function ConfirmCustom() {
  const dispatch = useDispatch()
  const {status} = useSelector(state=>{
    return{
      status : state?.custom?.status
    }
  })
  const location = useLocation()
  useEffect(()=>{
    const token = location.pathname.split('order-')[1]
    console.log(token)
    dispatch(setOrder(token))
  },[])
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <h3 className="title">Please wait for a moment.</h3>
      <p className="mb-2">We will make your order now.</p>
      {status && 
      <div>
      <p className="mb-2">Your order has been created.</p>
      <Button
        isButton
        isPrimary
        isLink
        title="Back"
        path="/"
      />
      </div>
      }
    </div>
  );
}
