import React, { useEffect } from "react";
import Button from "../../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { setOrder } from "../../../store/slices/custom/slices";

export default function ConfirmCustom() {
  const dispatch = useDispatch()
  const {status,role} = useSelector(state=>{
    return{
      status : state?.custom?.status,
      role : state?.auth?.role
    }
  })
  const location = useLocation()
  const token = location.pathname.split('order-')[1]
  useEffect(()=>{
    // console.log(token)
    dispatch(setOrder(token))
  },[])

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <h3 className="title">Please wait for a moment.</h3>
      <p className="mb-2">We will make your order now.</p>
      { role === 2 ?
      status ?
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
       : <div></div> : <div></div>}
    </div>
  );
}
