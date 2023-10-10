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
    if(role === 2){
      dispatch(setOrder(token))
    }
  },[])

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      {role !== 2 && 
      <div>
      <h3 className="title">Please login to your account</h3>
      <p className="mb-2">We need to make sure that only our customers could confirm the order.</p>
      </div>
      }
      { (role === 2 && !status) && 
      <div>
      <h3 className="title">Please wait for a moment.</h3>
      <p className="mb-2">We will verify and make your order now.</p>
      </div>}
      {status &&
      <div>
        <h3 className="title">Hurray!</h3>
      <p className="mb-2">Your order has been created.</p>
      <Button
        isButton
        isPrimary
        isLink
        title="Back"
        path="/"
      />
      </div>}
      
       
    </div>
  );
}
